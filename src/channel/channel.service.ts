import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentEntity } from 'src/content/entities/content.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChannelInput, InviteChannelOperatorInput } from './dto/create-channel.dto';
import { DeleteChannelInput, DeleteChannelOutput } from './dto/delete-channel.dto';
import { EditChannelInput, EditChannelOutput } from './dto/edit-channel.dto';
import { FindAllChannelInput, FindAllChannelOutput } from './dto/find-all-channel.dto';
import { FindChannelInput, FindChannelOutput } from './dto/find-channel.dto';
import { FindChannelTagOutput, FindTagByChannelIdInput, FindTagByChannelIdOutput, MutateChannelCategoryInput, MutateChannelCategoryOutput } from './dto/tag.dto';
import { ChannelEntity } from './entities/channel.entity';
import { ChannelCategoryEntity } from './entities/channel_category.entity';
import { ChannelOperatorEntity, ChannelOperatorStatus } from './entities/channel_operator.entity';
import { ChannelTagEntity } from './entities/channel_tag.entity';

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
    private readonly channelCategoryRepository: Repository<ChannelCategoryEntity>
  ) { }

  async findAllChannel({ page }: FindAllChannelInput): Promise<FindAllChannelOutput> {
    try {
      const [results, totalResults] = await this.channelRepository.findAndCount({
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

  async findChannel({ channelId }: FindChannelInput): Promise<FindChannelOutput> {
    try {
      const results = await this.channelRepository.findOneByOrFail({
        id: channelId
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

  async countContents(channelId: ChannelEntity['id']): Promise<number> {
    return await this.contentRepository.count({ where: { channel: { id: channelId } } })
  }

  // TODO: transaction
  async createChannel(
    writer: UserEntity,
    { tagId, ...createChannelInput }: CreateChannelInput,
    inviteChannelOperatorInput: InviteChannelOperatorInput
  ) {
    try {
      const newChannel = this.channelRepository.create(createChannelInput);

      const channel = await this.channelRepository.save(newChannel)
      // TODO: 채널 운영진 (만든사람이 먼저 대표자가 되도록)
      const newChannelOperator = this.channelOperatorRepository.create({
        userId: writer.id,
        channelId: newChannel.id,
        user: writer,
        channel: newChannel,
        status: ChannelOperatorStatus.RUNNING
      })

      await this.channelOperatorRepository.save(newChannelOperator)
      channel.operators = [newChannelOperator]
      // TODO: 채널 운영진 초대 메일 발송

      const categoryResult = await this.mutateChannelCategory({ channelId: channel.id, tagId })
      if (categoryResult.ok) {
        channel.category = categoryResult.results
      } else {
        return categoryResult
      }
      // TODO: 채널 과금 정책 생성 cascade

      // TODO: 채널 허가를 어떻게 관리할지
      // TODO: 유저 -> 크리에이터 롤을 취득하고 채널을 만들 수 있게 할지
      await this.channelRepository.save(channel)
      return {
        ok: true
      }
    } catch (error) {
      return {
        ok: false,
        error
      }
    }
  }

  async editChannel(
    writer: UserEntity,
    { channelId, tagId, ...editChannelInput }: EditChannelInput
  ): Promise<EditChannelOutput> {
    try {
      const channel = await this.channelRepository.findOne(
        {
          where: { id: channelId },
          loadRelationIds: true
        },
      )
      if (!channel) {
        return {
          ok: false,
          error: '채널이 존재하지 않습니다.'
        }
      }
      // TODO: 채널 운영진에 로그인 유저가 속해 있는지 확인
      // if (writer.id !== channel.writerId) {
      //     return {
      //         ok: false,
      //         error: "채널 수정 권한이 없습니다."
      //     }
      // }
      let category;
      const categoryResult = await this.mutateChannelCategory({ channelId, tagId })
      if (categoryResult.ok) {
        category = categoryResult.results
      } else {
        return categoryResult
      }

      // TODO: 카테고리 끼워넣기
      await this.channelRepository.save({
        id: channel.id,
        ...editChannelInput,
        ...(category && { category })
      })
      return {
        ok: true
      }
    } catch (error) {
      console.log(error)
      return {
        ok: false,
        error: '채널을 수정할 수 없습니다.'
      }
    }
  }

  async deleteChannel(
    writer: UserEntity,
    deleteChannelInput: DeleteChannelInput
  ): Promise<DeleteChannelOutput> {
    try {
      const channel = await this.channelRepository.findOne(
        {
          where: { id: deleteChannelInput.channelId },
          loadRelationIds: true
        },
      )
      if (!channel) {
        return {
          ok: false,
          error: '채널이 존재하지 않습니다.'
        }
      }
      // TODO: 채널 운영진에 로그인 유저가 속해 있는지 확인
      // if (writer.id !== channel.writerId) {
      //     return {
      //         ok: false,
      //         error: "채널 삭제 권한이 없습니다."
      //     }
      // }

      // TODO: soft delete로 변경
      await this.channelRepository.delete(deleteChannelInput.channelId)
      return {
        ok: true
      }
    } catch (error) {
      return {
        ok: false,
        error: '채널을 삭제할 수 없습니다.'
      }
    }
  }

  // TODO: 공동 운영자 초대 이메일 링크 누르면 조인 폼 뜨면서 해당 로직으로 채널 운영진 등록되도록


  async findAllTagOptions(): Promise<FindChannelTagOutput> {
    try {
      const tags = await this.channelTagRepository.find()

      const options = tags?.map(tag => ({
        value: tag.id,
        label: tag.name
      }))

      return {
        ok: true,
        results: options
      }
    } catch {
      return {
        ok: false,
        error: "채널 태그를 불러올 수 없습니다."
      }
    }
  }

  async findTagByChannelId({ channelId }: FindTagByChannelIdInput): Promise<FindTagByChannelIdOutput> {
    try {
      const category = await this.channelCategoryRepository.findOne({
        where: {
          channelId
        },
        relations: { tag: true }
      })

      return {
        ok: true,
        results: category.tag
      }
    } catch {
      return {
        ok: false,
        error: "채널 태그를 불러올 수 없습니다."
      }
    }
  }

  async mutateChannelCategory({ tagId, channelId }: MutateChannelCategoryInput): Promise<MutateChannelCategoryOutput> {
    try {
      const category = await this.channelCategoryRepository.findOne({
        where: {
          channelId,
        }
      })

      let results;
      // 생성
      if (!category) {
        results = this.channelCategoryRepository.create({ channelId, tagId })
      }

      // 수정
      if (category && category.tagId !== tagId) {
        results = await this.channelCategoryRepository.update({ channelId }, { tagId })
      }

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
}
