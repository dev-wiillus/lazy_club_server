import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '@root/common/common.service';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { UploadService } from 'src/upload/upload.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import {
	CreateContentInput,
	CreateContentOutput,
} from './dto/create-content.dto';
import {
	DeleteContentInput,
	DeleteContentOutput,
} from './dto/delete-content.dto';
import { EditContentInput, EditContentOutput } from './dto/edit-content.dto';
import {
	FindAllContentInput,
	FindAllContentOutput,
} from './dto/find-all-content.dto';
import { FindContentInput, FindContentOutput } from './dto/find-content.dto';
import { ContentEntity, ContentStatus } from './entities/content.entity';
import { ContentFileEntity } from './entities/content_file.entity';

@Injectable()
export class ContentService {
	constructor(
		@InjectRepository(ContentEntity)
		private readonly contentRepository: Repository<ContentEntity>,
		@InjectRepository(ContentFileEntity)
		private readonly contentFileRepository: Repository<ContentFileEntity>,
		@InjectRepository(ChannelEntity)
		private readonly channelRepository: Repository<ChannelEntity>,
		private readonly uploadService: UploadService,
		private readonly commonService: CommonService,
	) { }

	async findAllContent({
		channelId,
		title,
		page,
	}: FindAllContentInput): Promise<FindAllContentOutput> {
		try {
			const [results, totalResults] = await this.contentRepository.findAndCount(
				{
					where: {
						channel: {
							id: channelId,
						},
						status: ContentStatus.NORMAL,
						...(title && { title: ILike(`%${title}%`) }),
					},
					take: 25 * page,
				},
			);
			return {
				ok: true,
				results,
				totalPages: Math.ceil(totalResults / 25),
				totalResults,
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}

	// TODO: 접근 권한 있는 사람만 열람가능하도록(해당 채널 크리에이터 그룹)
	// TODO: channel Id만 들어오면 작성자의 draft 보여주기
	async findContent(
		writer: UserEntity,
		{ contentId, channelId }: FindContentInput,
	): Promise<FindContentOutput> {
		try {
			const { content, ...results } = await this.contentRepository.findOne({
				where: {
					...(contentId && { id: contentId }),
					...(channelId && {
						channel: { id: channelId },
						writer: { id: writer.id },
						status: ContentStatus.DRAFT,
					}),
				},
			});
			const contentFiles = await this.contentFileRepository.find({
				where: {
					content: {
						id: results.id,
					},
					isPreview: true,
				},
			});
			let previewImage;
			let contentHtml;
			if (content) {
				contentHtml = await this.commonService.loadHtmlFile({
					path: content,
				});
			}
			if (contentFiles && contentFiles.length > 0) {
				previewImage = await this.commonService.loadImageFile({
					path: contentFiles[0].file,
				});
			}
			console.log('------------------')
			console.log(contentFiles)
			return {
				ok: true,
				results: {
					...results,
					...(contentHtml && contentHtml?.result && { content: contentHtml.result }),
					...(previewImage && { previewImage: previewImage.result }),
					...(contentFiles && { previewImageUrl: contentFiles[0].file }),

				},
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}

	async getPreviewImage(contentId: number): Promise<String> {
		const previewImage = await this.contentFileRepository.findOne({
			where: { content: { id: contentId }, isPreview: true },
		});
		if (previewImage)
			return previewImage.file;
		return
	}

	// TODO: html 본문 파일로 저장, 불러오기
	// 새로작성 페이지로 이동시 무조건 생성
	async createContent(
		writer: UserEntity,
		createContentInput: CreateContentInput,
	): Promise<CreateContentOutput> {
		try {
			const newContent = this.contentRepository.create(createContentInput);
			newContent.writer = writer;

			const channel = await this.channelRepository.findOne({
				where: {
					id: createContentInput.channelId,
				},
			});
			newContent.channel = channel;

			await this.contentRepository.save(newContent);
			const results = await this.contentRepository.findOne({
				where: { id: newContent.id },
				relations: { channel: true },
			});
			console.log(results);
			return {
				ok: true,
				results,
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}

	// 임시저장, 생성, 수정
	async editContent(
		writer: UserEntity,
		editContentInput: EditContentInput,
	): Promise<EditContentOutput> {
		try {
			console.log('----------------------')
			const content = await this.contentRepository.findOne({
				where: { id: editContentInput.id },
				relations: {
					channel: true,
				},
			});
			if (!content) {
				return {
					ok: false,
					error: '콘텐츠가 존재하지 않습니다.',
				};
			}
			// TODO: 채널 운영진들이 함께 수정할 수 있도록 변경
			if (writer.id !== content.writerId) {
				return {
					ok: false,
					error: '콘텐츠 수정 권한이 없습니다.',
				};
			}

			console.log('----------------------0')
			content.title = editContentInput.title;
			content.status = editContentInput.status;

			if (editContentInput.content) {
				const contentResult = await this.uploadService.contentUploadFile({
					content,
					file: editContentInput.content,
				});
				if (contentResult.ok) {
					content.content = contentResult.filePath;
				} else {
					return contentResult;
				}
			}
			console.log('----------------------1')
			if (editContentInput.previewImage) {
				const previewContentFile = await this.contentFileRepository.findOne({
					where: { content: { id: editContentInput.id }, isPreview: true },
				});
				const uploadResult = previewContentFile
					? await this.uploadService.editContentFile({
						id: previewContentFile.id,
						file: editContentInput.previewImage,
					})
					: await this.uploadService.createContentFile({
						contentId: content.id,
						file: editContentInput.previewImage,
						isPreview: true,
					});
				if (uploadResult.ok) {
					// content.contentFiles = [uploadResult.result] TODO: 에러 이유 찾기
				} else {
					return uploadResult;
				}
			}
			console.log('----------------------2')
			await this.contentRepository.save(content);
			const { content: contentPath, ...results } =
				await this.contentRepository.findOne({
					where: { id: editContentInput.id },
				});
			const contentHtml = await this.commonService.loadHtmlFile({
				path: contentPath,
			});
			console.log('----------------------3')
			return {
				ok: true,
				results: {
					...results,
					content: contentHtml.result,
				},
			};
		} catch (error) {
			console.log(error);
			return {
				ok: false,
				error: '콘텐츠를 수정할 수 없습니다.',
			};
		}
	}

	async deleteContent(
		writer: UserEntity,
		deleteContentInput: DeleteContentInput,
	): Promise<DeleteContentOutput> {
		try {
			const content = await this.contentRepository.findOne({
				where: { id: deleteContentInput.contentId },
				loadRelationIds: true,
			});
			if (!content) {
				return {
					ok: false,
					error: '콘텐츠가 존재하지 않습니다.',
				};
			}
			// TODO: 채널 운영진들이 함께 삭제할 수 있도록 변경
			if (writer.id !== content.writerId) {
				return {
					ok: false,
					error: '콘텐츠 삭제 권한이 없습니다.',
				};
			}

			// TODO: soft delete로 변경
			await this.contentRepository.delete(deleteContentInput.contentId);
			return {
				ok: true,
			};
		} catch (error) {
			return {
				ok: false,
				error: '콘텐츠를 삭제할 수 없습니다.',
			};
		}
	}
}
