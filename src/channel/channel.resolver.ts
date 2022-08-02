import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth-local/auth-user.decorator";
import { Role } from "src/auth-local/role.decorator";
import { ContentService } from "src/content/content.service";
import { UserEntity } from "src/user/entities/user.entity";
import { ChannelService } from "./channel.service";
import { CreateChannelInput, CreateChannelOutput, InviteChannelOperatorInput } from "./dto/create-channel.dto";
import { DeleteChannelInput, DeleteChannelOutput } from "./dto/delete-channel.dto";
import { EditChannelInput, EditChannelOutput } from "./dto/edit-channel.dto";
import { FindAllChannelInput, FindAllChannelOutput } from "./dto/find-all-channel.dto";
import { FindChannelInput, FindChannelOutput } from "./dto/find-channel.dto";
import { FindChannelTagOutput, FindTagByChannelIdInput, FindTagByChannelIdOutput } from "./dto/tag.dto";
import { ChannelEntity } from "./entities/channel.entity";


@Resolver(of => ChannelEntity)
export class ChannelResolver {
    constructor(
        private readonly channelService: ChannelService,
    ) { }

    @ResolveField(type => Int)
    contentsCount(@Parent() channel: ChannelEntity): Promise<number> {
        return this.channelService.countContents(channel.id)
    }

    @Query(returns => FindAllChannelOutput)
    findAllChannel(
        @Args('input') findAllChannelInput: FindAllChannelInput
    ): Promise<FindAllChannelOutput> {
        return this.channelService.findAllChannel(findAllChannelInput)
    }

    @Query(returns => FindChannelOutput)
    findChannel(
        @Args('input') findChannelInput: FindChannelInput
    ): Promise<FindChannelOutput> {
        return this.channelService.findChannel(findChannelInput)
    }

    @Mutation(returns => CreateChannelOutput)
    @Role(['Creater'])
    async createChannel(
        @AuthUser() authUser: UserEntity,
        @Args('channelInput') createChannelInput: CreateChannelInput,
        @Args('channelOperatorInput') inviteChannelOperatorInput: InviteChannelOperatorInput
    ): Promise<CreateChannelOutput> {
        return this.channelService.createChannel(
            authUser,
            createChannelInput,
            inviteChannelOperatorInput
        )
    }

    @Mutation(returns => EditChannelOutput)
    @Role(['Creater'])
    async editChannel(
        @AuthUser() authUser: UserEntity,
        @Args('channelInput') editChannelInput: EditChannelInput
    ): Promise<EditChannelOutput> {
        return this.channelService.editChannel(
            authUser,
            editChannelInput
        )
    }

    @Mutation(returns => DeleteChannelOutput)
    @Role(['Creater'])
    async deleteChannel(
        @AuthUser() authUser: UserEntity,
        @Args('channelInput') deleteChannelInput: DeleteChannelInput
    ): Promise<DeleteChannelOutput> {
        return this.channelService.deleteChannel(
            authUser,
            deleteChannelInput
        )
    }

    @Query(returns => FindChannelTagOutput)
    async findAllTagOptions(): Promise<FindChannelTagOutput> {
        return this.channelService.findAllTagOptions()
    }

    @Query(returns => FindTagByChannelIdOutput)
    async findTagByChannelId(
        @Args('input') findTagByChannelIdInput: FindTagByChannelIdInput
    ): Promise<FindTagByChannelIdOutput> {
        return this.channelService.findTagByChannelId(findTagByChannelIdInput)
    }
}