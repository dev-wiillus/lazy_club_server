import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentEntity } from 'src/content/entities/content.entity';
import { ContentFileEntity } from 'src/content/entities/content_file.entity';
import { Repository } from 'typeorm';
import {
	ContentUploadFileInput,
	ContentUploadFileOutput,
	CreateContentFileInput,
	CreateContentFileOutput,
	EditContentFileInput,
	EditContentFileOutput,
} from './dto/content-file.dto';
import * as fs from 'fs/promises';
import { UploadFileInput, UploadFileOutput } from './dto/upload-file.dto';
import { UserEntity } from '@root/user/entities/user.entity';
import { UploadUserFileInput, UploadUserFileOutput } from './dto/user-file.dto';
import {
	UploadChannelFileInput,
	UploadChannelFileOutput,
} from './dto/channel-file.dto';
import { ChannelEntity } from '@root/channel/entities/channel.entity';

@Injectable()
export class UploadService {
	constructor(
		@InjectRepository(ContentEntity)
		private readonly contentRepository: Repository<ContentEntity>,
		@InjectRepository(ContentFileEntity)
		private readonly contentFileRepository: Repository<ContentFileEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(ChannelEntity)
		private readonly channelRepository: Repository<ChannelEntity>,
	) {}

	async createContentFile({
		contentId,
		file,
		isPreview,
	}: CreateContentFileInput): Promise<CreateContentFileOutput> {
		try {
			const content = await this.contentRepository.findOne({
				where: { id: contentId },
				relations: { channel: true },
			});
			const dirPath = `file/${content.channel.id}/${content.id}`;

			const { filePath } = await this.uploadFile({ file, dirPath });

			const contentFile = this.contentFileRepository.create({
				file: filePath,
				content,
				isPreview,
			});
			const result = await this.contentFileRepository.save(contentFile);
			return {
				ok: true,
				result,
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}

	async editContentFile({
		id,
		file,
	}: EditContentFileInput): Promise<EditContentFileOutput> {
		try {
			const contentFile = await this.contentFileRepository.findOne({
				where: { id },
				relations: { content: { channel: true } },
			});
			if (contentFile && contentFile.file) {
				fs.unlink(`static/${contentFile.file}`);
			}

			const dirPath = `channel/file/${contentFile.content.channel.id}/${contentFile.content.id}`;
			const { filePath } = await this.uploadFile({ file, dirPath });

			contentFile.file = filePath;
			const result = await this.contentFileRepository.save(contentFile);
			return {
				ok: true,
				result,
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}

	async contentUploadFile({
		content,
		file,
	}: ContentUploadFileInput): Promise<ContentUploadFileOutput> {
		if (content && content.content) {
			fs.unlink(`static/${content.content}`);
		}
		const dirPath = `channel/file/${content.channel.id}/${content.id}`;
		return await this.uploadFile({ file, dirPath });
	}

	async userProfileUploadFile({
		user,
		file,
	}: UploadUserFileInput): Promise<UploadUserFileOutput> {
		if (user && user.profile) {
			fs.unlink(`static/${user.profile}`);
		}
		const dirPath = `user/file/${user.id}`;
		return await this.uploadFile({ file, dirPath });
	}

	async channelProfileUploadFile({
		channel,
		file,
	}: UploadChannelFileInput): Promise<UploadChannelFileOutput> {
		if (channel && channel.thumbnail) {
			fs.unlink(`static/${channel.thumbnail}`);
		}
		const dirPath = `channel/file/${channel.id}`;
		return await this.uploadFile({ file, dirPath });
	}

	async uploadFile({
		file,
		dirPath,
	}: UploadFileInput): Promise<UploadFileOutput> {
		try {
			const { createReadStream, filename } = await file;
			const filePath = `${dirPath}/${filename}`;
			const stream = createReadStream();
			const chunks = [];
			const buffer = await new Promise<Buffer>((resolve, reject) => {
				let buffer: Buffer;

				stream.on('data', function (chunk) {
					chunks.push(chunk);
				});

				stream.on('end', function () {
					buffer = Buffer.concat(chunks);
					resolve(buffer);
				});

				stream.on('error', reject);
			});

			fs.mkdir(`static/${dirPath}`, { recursive: true }).then(() => {
				fs.writeFile(`static/${filePath}`, buffer);
			});

			return {
				ok: true,
				filePath,
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}
}
