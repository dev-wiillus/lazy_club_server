import {
	Args,
	Int,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth-local/auth-user.decorator';
import { Role } from 'src/auth-local/role.decorator';
import { ContentService } from 'src/content/content.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelService } from './channel.service';
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
import {
	CheckOpenAlertInput,
	RegisterOpenAlertInput,
	RegisterOpenAlertOutput,
} from './dto/open-alert.dto';
import {
	FindChannelTagOutput,
	FindTagByChannelIdInput,
	FindTagByChannelIdOutput,
} from './dto/tag.dto';
import { ChannelEntity } from './entities/channel.entity';

@Resolver((of) => ChannelEntity)
export class ChannelResolver {
	constructor(private readonly channelService: ChannelService) {}

	@ResolveField((type) => Int)
	contentsCount(@Parent() channel: ChannelEntity): Promise<number> {
		return this.channelService.countContents(channel.id);
	}

	@ResolveField((type) => Int)
	alertsCount(@Parent() channel: ChannelEntity): Promise<number> {
		return this.channelService.countAlerts(channel.id);
	}

	@ResolveField((type) => Boolean)
	hasDraftContent(@Parent() channel: ChannelEntity): Promise<boolean> {
		return this.channelService.checkDraftContent(channel.id);
	}

	@Query((returns) => Boolean)
	checkOpenAlert(
		@AuthUser() authUser: UserEntity,
		@Args('input') checkOpenAlertInput: CheckOpenAlertInput,
	): Promise<boolean> {
		return this.channelService.checkOpenAlert(
			checkOpenAlertInput.channelId,
			authUser.id,
		);
	}

	@Query((returns) => FindAllChannelOutput)
	findAllChannel(
		@Args('input') findAllChannelInput: FindAllChannelInput,
	): Promise<FindAllChannelOutput> {
		return this.channelService.findAllChannel(findAllChannelInput);
	}

	@Query((returns) => FindChannelOutput)
	findChannel(
		@Args('input') findChannelInput: FindChannelInput,
	): Promise<FindChannelOutput> {
		return this.channelService.findChannel(findChannelInput);
	}

	@Mutation((returns) => CreateChannelOutput)
	@Role(['Creator'])
	async createChannel(
		@AuthUser() authUser: UserEntity,
		@Args('channelInput') createChannelInput: CreateChannelInput,
		@Args('channelOperatorInput')
		inviteChannelOperatorInput: InviteChannelOperatorInput,
	): Promise<CreateChannelOutput> {
		return this.channelService.createChannel(
			authUser,
			createChannelInput,
			inviteChannelOperatorInput,
		);
	}

	@Mutation((returns) => EditChannelOutput)
	@Role(['Creator'])
	async editChannel(
		@AuthUser() authUser: UserEntity,
		@Args('channelInput') editChannelInput: EditChannelInput,
	): Promise<EditChannelOutput> {
		return this.channelService.editChannel(authUser, editChannelInput);
	}

	@Mutation((returns) => DeleteChannelOutput)
	@Role(['Creator'])
	async deleteChannel(
		@AuthUser() authUser: UserEntity,
		@Args('channelInput') deleteChannelInput: DeleteChannelInput,
	): Promise<DeleteChannelOutput> {
		return this.channelService.deleteChannel(authUser, deleteChannelInput);
	}

	@Query((returns) => FindChannelTagOutput)
	async findAllTagOptions(): Promise<FindChannelTagOutput> {
		return this.channelService.findAllTagOptions();
	}

	@Query((returns) => FindTagByChannelIdOutput)
	async findTagByChannelId(
		@Args('input') findTagByChannelIdInput: FindTagByChannelIdInput,
	): Promise<FindTagByChannelIdOutput> {
		return this.channelService.findTagByChannelId(findTagByChannelIdInput);
	}

	@Mutation((returns) => RegisterOpenAlertOutput)
	@Role(['User', 'Creator'])
	async openAlert(
		@AuthUser() authUser: UserEntity,
		@Args('input') openAlertInput: RegisterOpenAlertInput,
	): Promise<RegisterOpenAlertOutput> {
		return this.channelService.openAlert(authUser, openAlertInput);
	}
}
