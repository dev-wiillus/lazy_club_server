import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '@root/mail/mail.service';
import { UploadService } from '@root/upload/upload.service';
import {
  ContentEntity,
  ContentStatus,
} from 'src/content/entities/content.entity';
import { UserEntity, UserRole } from 'src/user/entities/user.entity';
import {
  Repository,
} from 'typeorm';
import {
  CreateChannelInput,
  CreateChannelOutput,
  InviteChannelOperatorInput,
} from './dto/create-channel.dto';
import {
  DeleteChannelInput,
  DeleteChannelOutput,
} from './dto/delete-channel.dto';
import { EditChannelInput, EditChannelOutput } from './dto/edit-channel.dto';
import {
  FindAllChannelInput,
  FindAllChannelOutput,
} from './dto/find-all-channel.dto';
import { FindChannelInput, FindChannelOutput } from './dto/find-channel.dto';
import { OpenAlertInput, OpenAlertOutput } from './dto/open-alert.dto';
import {
  FindChannelTagOutput,
  FindTagByChannelIdInput,
  FindTagByChannelIdOutput,
  MutateChannelCategoryInput,
  MutateChannelCategoryOutput,
} from './dto/tag.dto';
import { ChannelEntity, ChannelStatus } from './entities/channel.entity';
import { ChannelCategoryEntity } from './entities/channel_category.entity';
import {
  ChannelOperatorEntity,
  ChannelOperatorStatus,
} from './entities/channel_operator.entity';
import { ChannelTagEntity } from './entities/channel_tag.entity';
import { OpenAlertEntity } from './entities/open_alert.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(ChannelOperatorEntity)
    private readonly channelOperatorRepository: Repository<ChannelOperatorEntity>,
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
    @InjectRepository(ChannelTagEntity)
    private readonly channelTagRepository: Repository<ChannelTagEntity>,
    @InjectRepository(ChannelCategoryEntity)
    private readonly channelCategoryRepository: Repository<ChannelCategoryEntity>,
    @InjectRepository(OpenAlertEntity)
    private readonly openAlertRepository: Repository<OpenAlertEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly uploadService: UploadService,
    private readonly mailService: MailService,
  ) { }

  async findAllChannel({
    page,
  }: FindAllChannelInput): Promise<FindAllChannelOutput> {
    try {
      const [results, totalResults] = await this.channelRepository.findAndCount(
        {
          take: 25,
          skip: (page - 1) * 25,
          relations: {
            categories: {
              tag: true,
            },
            operators: {
              user: true,
            },
          },
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

  // TODO: 추후에 operatorId(in)로 여러 채널 읽어들이는 방법 찾기
  async findChannel({
    channelId,
    userId,
  }: FindChannelInput): Promise<FindChannelOutput> {
    try {
      console.log(userId);
      const results = await this.channelRepository.findOne({
        where: {
          ...(channelId && { id: channelId }),
          ...(userId && {
            operators: {
              userId,
            },
          }),
        },
        relations: {
          categories: {
            tag: true,
          },
          operators: {
            user: true,
          },
        },
      });
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

  async countContents(channelId: ChannelEntity['id']): Promise<number> {
    return await this.contentRepository.count({
      where: { channel: { id: channelId } },
    });
  }

  async countAlerts(channelId: ChannelEntity['id']): Promise<number> {
    return await this.openAlertRepository.count({
      where: { channel: { id: channelId } },
    });
  }

  async checkDraftContent(channelId: ChannelEntity['id']): Promise<boolean> {
    return Boolean(
      await this.contentRepository.findOne({
        where: {
          channel: {
            id: channelId,
          },
          status: ContentStatus.DRAFT,
        },
      }),
    );
  }

  async checkOpenAlert(
    channelId: ChannelEntity['id'],
    userId: UserEntity['id'],
  ): Promise<boolean> {
    return Boolean(
      await this.openAlertRepository.findOne({
        where: {
          channel: { id: channelId },
          user: { id: userId },
        },
      }),
    );
  }

  // TODO: transaction
  async createChannel(
    writer: UserEntity,
    {
      tagId,
      thumbnail,
      userProfile,
      ...createChannelInput
    }: CreateChannelInput,
    inviteChannelOperatorInput: InviteChannelOperatorInput,
  ): Promise<CreateChannelOutput> {
    try {
      // TODO: 한 사람당 채널 하나만 만들수 있도록
      const createdChannel = this.channelRepository.create({
        ...createChannelInput,
        status: ChannelStatus.RUNNING,
      });

      const channel = await this.channelRepository.save(createdChannel);

      const createdChannelOperator = this.channelOperatorRepository.create({
        userId: writer.id,
        channelId: channel.id,
        user: {
          ...writer,
          role: UserRole.Creator,
        },
        channel,
        status: ChannelOperatorStatus.RUNNING,
      });
      await this.channelOperatorRepository.save(createdChannelOperator);

      const operators = await this.channelOperatorRepository.findBy({
        channelId: createdChannelOperator.channelId,
        userId: writer.id,
      });
      channel.operators = operators;
      channel.leader = operators[0]; // 만든사람이 먼저 대표자가 되도록
      // TODO: 채널 운영진 초대 메일 발송
      if (inviteChannelOperatorInput.emails) {
        // this.mailService.inviteChannelOperatorEmail(inviteChannelOperatorInput.emails)
      }

      if (thumbnail) {
        const thumbnailUploadResult =
          await this.uploadService.channelProfileUploadFile({
            channel,
            file: thumbnail,
          });
        if (thumbnailUploadResult.ok) {
          console.log(thumbnailUploadResult);
          channel.thumbnail = thumbnailUploadResult.filePath;
        } else {
          return thumbnailUploadResult;
        }
      }

      if (userProfile) {
        const userProfileUploadResult =
          await this.uploadService.userProfileUploadFile({
            user: writer,
            file: userProfile,
          });
        if (userProfileUploadResult.ok) {
          writer.profile = userProfileUploadResult.filePath;
          await this.userRepository.save(writer);
        } else {
          return userProfileUploadResult;
        }
      }

      const categoryResult = await this.mutateChannelCategory({
        channelId: channel.id,
        tagId,
      });
      if (categoryResult.ok) {
        channel.categories = categoryResult.results;
      } else {
        return categoryResult;
      }
      // TODO: 채널 과금 정책 생성 cascade

      await this.channelRepository.save(channel);
      const result = await this.channelRepository.findOne({
        where: { id: channel.id },
        relations: {
          operators: {
            user: true,
          },
          categories: {
            tag: true,
          },
        },
      });
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

  async editChannel(
    writer: UserEntity,
    { channelId, tagId, ...editChannelInput }: EditChannelInput,
  ): Promise<EditChannelOutput> {
    try {
      const channel = await this.channelRepository.findOne({
        where: { id: channelId },
        loadRelationIds: true,
      });
      if (!channel) {
        return {
          ok: false,
          error: '채널이 존재하지 않습니다.',
        };
      }
      // TODO: 채널 운영진에 로그인 유저가 속해 있는지 확인
      // if (writer.id !== channel.writerId) {
      //     return {
      //         ok: false,
      //         error: "채널 수정 권한이 없습니다."
      //     }
      // }
      let category;
      const categoryResult = await this.mutateChannelCategory({
        channelId,
        tagId,
      });
      if (categoryResult.ok) {
        category = categoryResult.results;
      } else {
        return categoryResult;
      }

      // TODO: 카테고리 끼워넣기
      // await this.channelRepository.save({
      //   id: channel.id,
      //   ...editChannelInput,
      //   ...(category && { category })
      // })
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: '채널을 수정할 수 없습니다.',
      };
    }
  }

  async deleteChannel(
    writer: UserEntity,
    deleteChannelInput: DeleteChannelInput,
  ): Promise<DeleteChannelOutput> {
    try {
      const channel = await this.channelRepository.findOne({
        where: { id: deleteChannelInput.channelId },
        loadRelationIds: true,
      });
      if (!channel) {
        return {
          ok: false,
          error: '채널이 존재하지 않습니다.',
        };
      }
      // TODO: 채널 운영진에 로그인 유저가 속해 있는지 확인
      // if (writer.id !== channel.writerId) {
      //     return {
      //         ok: false,
      //         error: "채널 삭제 권한이 없습니다."
      //     }
      // }

      // TODO: soft delete로 변경
      await this.channelRepository.delete(deleteChannelInput.channelId);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: '채널을 삭제할 수 없습니다.',
      };
    }
  }

  // TODO: 공동 운영자 초대 이메일 링크 누르면 조인 폼 뜨면서 해당 로직으로 채널 운영진 등록되도록

  async findAllTagOptions(): Promise<FindChannelTagOutput> {
    try {
      const tags = await this.channelTagRepository.find();

      const options = tags?.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }));

      return {
        ok: true,
        results: options,
      };
    } catch {
      return {
        ok: false,
        error: '채널 태그를 불러올 수 없습니다.',
      };
    }
  }

  async findTagByChannelId({
    channelId,
  }: FindTagByChannelIdInput): Promise<FindTagByChannelIdOutput> {
    try {
      const category = await this.channelCategoryRepository.findOne({
        where: {
          channelId,
        },
        relations: { tag: true },
      });

      return {
        ok: true,
        results: category.tag,
      };
    } catch {
      return {
        ok: false,
        error: '채널 태그를 불러올 수 없습니다.',
      };
    }
  }

  async mutateChannelCategory({
    tagId,
    channelId,
  }: MutateChannelCategoryInput): Promise<MutateChannelCategoryOutput> {
    try {
      const category = await this.channelCategoryRepository.findOne({
        where: {
          channelId,
        },
      });

      // 생성
      if (!category) {
        const createdCategory = this.channelCategoryRepository.create({
          channelId,
          tagId,
        });
        await this.channelCategoryRepository.save(createdCategory);
      }

      // 수정
      if (category && category.tagId !== tagId) {
        await this.channelCategoryRepository.update({ channelId }, { tagId });
      }

      const results = await this.channelCategoryRepository.findOne({
        where: {
          channelId,
          tagId,
        },
      });
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

  async openAlert(
    writer: UserEntity,
    openAlertInput: OpenAlertInput,
  ): Promise<OpenAlertOutput> {
    try {
      const openAlert = this.openAlertRepository.create({
        ...openAlertInput,
        user: writer,
      });
      await this.openAlertRepository.save(openAlert);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
