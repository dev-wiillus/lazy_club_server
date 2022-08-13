import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateContentInput, CreateContentOutput } from './dto/create-content.dto';
import { DeleteContentInput, DeleteContentOutput } from './dto/delete-content.dto';
import { EditContentInput, EditContentOutput } from './dto/edit-content.dto';
import { FindAllContentInput, FindAllContentOutput } from './dto/find-all-content.dto';
import { FindContentInput, FindContentOutput } from './dto/find-content.dto';
import { ContentEntity } from './entities/content.entity';

@Injectable()
export class ContentService {
    constructor(
        @InjectRepository(ContentEntity)
        private readonly contentRepository: Repository<ContentEntity>,
        @InjectRepository(ChannelEntity)
        private readonly channelRepository: Repository<ChannelEntity>,
    ) { }

    async findAllContent({ channelId, title, page }: FindAllContentInput): Promise<FindAllContentOutput> {
        try {
            const [results, totalResults] = await this.contentRepository.findAndCount({
                where: {
                    channel: {
                        id: channelId
                    },
                    ...(title && { title: ILike(`%${title}%`) })
                },
                take: 25,
                skip: (page - 1) * 25
            })
            return {
                ok: true,
                results,
                totalPages: Math.ceil(totalResults / 25),
                totalResults
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }

    async findContent({ contentId }: FindContentInput): Promise<FindContentOutput> {
        try {
            const results = await this.contentRepository.findOneByOrFail({
                id: contentId
            })
            return {
                ok: true,
                results
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }


    async createContent(writer: UserEntity, createContentInput: CreateContentInput): Promise<CreateContentOutput> {
        try {
            const newContent = this.contentRepository.create(createContentInput);
            newContent.writer = writer

            // TODO: 채널이 잘들어가도록
            const channel = await this.channelRepository.findOne({
                where: {
                    id: createContentInput.channelId
                }
            })
            newContent.channel = channel
            await this.contentRepository.save(newContent)
            const results = await this.contentRepository.findOne({ where: { id: newContent.id } })
            return {
                ok: true,
                results
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }

    async editContent(
        writer: UserEntity,
        editContentInput: EditContentInput,
    ): Promise<EditContentOutput> {
        try {
            const content = await this.contentRepository.findOne(
                {
                    where: { id: editContentInput.contentId },
                    loadRelationIds: true
                },
            )
            if (!content) {
                return {
                    ok: false,
                    error: '콘텐츠가 존재하지 않습니다.'
                }
            }
            // TODO: 채널 운영진들이 함께 수정할 수 있도록 변경
            if (writer.id !== content.writerId) {
                return {
                    ok: false,
                    error: "콘텐츠 수정 권한이 없습니다."
                }
            }

            await this.contentRepository.save([
                {
                    id: editContentInput.contentId,
                    ...editContentInput,
                }
            ])
            const results = await this.contentRepository.findOne({ where: { id: editContentInput.contentId } })
            return {
                ok: true,
                results
            }
        } catch (error) {
            return {
                ok: false,
                error: '콘텐츠를 수정할 수 없습니다.'
            }
        }
    }

    async deleteContent(
        writer: UserEntity,
        deleteContentInput: DeleteContentInput
    ): Promise<DeleteContentOutput> {
        try {
            const content = await this.contentRepository.findOne(
                {
                    where: { id: deleteContentInput.contentId },
                    loadRelationIds: true
                },
            )
            if (!content) {
                return {
                    ok: false,
                    error: '콘텐츠가 존재하지 않습니다.'
                }
            }
            // TODO: 채널 운영진들이 함께 삭제할 수 있도록 변경
            if (writer.id !== content.writerId) {
                return {
                    ok: false,
                    error: "콘텐츠 삭제 권한이 없습니다."
                }
            }

            // TODO: soft delete로 변경
            await this.contentRepository.delete(deleteContentInput.contentId)
            return {
                ok: true
            }
        } catch (error) {
            return {
                ok: false,
                error: '콘텐츠를 삭제할 수 없습니다.'
            }
        }
    }
}
