import { SetMetadata } from '@nestjs/common';
import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { Role } from 'src/auth-local/role.decorator';
import { AuthUser } from 'src/auth-local/auth-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { ContentService } from './content.service';
import {
	CreateContentInput,
	CreateContentOutput,
} from './dto/create-content.dto';
import { ContentEntity } from './entities/content.entity';
import { EditContentInput, EditContentOutput } from './dto/edit-content.dto';
import {
	DeleteContentInput,
	DeleteContentOutput,
} from './dto/delete-content.dto';
import {
	FindAllContentInput,
	FindAllContentOutput,
} from './dto/find-all-content.dto';
import { FindContentInput, FindContentOutput } from './dto/find-content.dto';
import { CommonService } from '@root/common/common.service';

@Resolver((of) => ContentEntity)
export class ContentResolver {
	constructor(
		private readonly contentService: ContentService,
		private readonly commonService: CommonService,
	) { }

	@ResolveField((type) => String, { nullable: true })
	async previewImageUrl(@Parent() content: ContentEntity): Promise<String> {
		return this.contentService.getPreviewImage(content.id);
	}

	@Query((returns) => FindAllContentOutput)
	findAllContent(
		@Args('input') findAllContentInput: FindAllContentInput,
	): Promise<FindAllContentOutput> {
		return this.contentService.findAllContent(findAllContentInput);
	}

	@Query((returns) => FindContentOutput)
	findContent(
		@AuthUser() authUser: UserEntity,
		@Args('input') findContentInput: FindContentInput,
	): Promise<FindContentOutput> {
		return this.contentService.findContent(authUser, findContentInput);
	}

	// TODO: 소속된 채널의 작성자들만 해당 채널에 콘텐츠를 올릴 수 있도록 거르기
	@Mutation((returns) => CreateContentOutput)
	@Role(['Creator'])
	async createContent(
		@AuthUser() authUser: UserEntity,
		@Args('input') createContentInput: CreateContentInput,
	): Promise<CreateContentOutput> {
		return this.contentService.createContent(authUser, createContentInput);
	}

	@Mutation((returns) => EditContentOutput)
	@Role(['Creator'])
	editContent(
		@AuthUser() authUser: UserEntity,
		@Args('input') editContentInput: EditContentInput,
	): Promise<EditContentOutput> {
		return this.contentService.editContent(authUser, editContentInput);
	}

	@Mutation((returns) => DeleteContentOutput)
	@Role(['Creator'])
	deleteContent(
		@AuthUser() authUser: UserEntity,
		@Args('input') deleteContentInput: DeleteContentInput,
	): Promise<DeleteContentOutput> {
		return this.contentService.deleteContent(authUser, deleteContentInput);
	}
}
