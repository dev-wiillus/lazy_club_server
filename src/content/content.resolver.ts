import { SetMetadata } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Role } from "src/auth-local/role.decorator";
import { AuthUser } from "src/auth-local/auth-user.decorator";
import { UserEntity } from "src/user/entities/user.entity";
import { ContentService } from "./content.service";
import { CreateContentInput, CreateContentOutput } from "./dto/create-content.dto";
import { ContentEntity } from "./entities/content.entity";
import { EditContentInput, EditContentOutput } from "./dto/edit-content.dto";
import { DeleteContentInput, DeleteContentOutput } from "./dto/delete-content.dto";
import { FindAllContentInput, FindAllContentOutput } from "./dto/find-all-content.dto";
import { FindContentInput, FindContentOutput } from "./dto/find-content.dto";

@Resolver(of => ContentEntity)
export class ContentResolver {
    constructor(private readonly contentService: ContentService) { }

    @Query(returns => FindAllContentOutput)
    findAllContent(
        @Args('input') findAllContentInput: FindAllContentInput
    ): Promise<FindAllContentOutput> {
        return this.contentService.findAllContent(findAllContentInput)
    }

    @Query(returns => FindContentOutput)
    findContent(
        @Args('input') findContentInput: FindContentInput
    ): Promise<FindContentOutput> {
        return this.contentService.findContent(findContentInput)
    }

    @Mutation(returns => CreateContentOutput)
    @Role(['Creator'])
    async createContent(
        @AuthUser() authUser: UserEntity,
        @Args('input') createContentInput: CreateContentInput
    ): Promise<CreateContentOutput> {
        return this.contentService.createContent(
            authUser,
            createContentInput
        )
    }

    @Mutation(returns => EditContentOutput)
    @Role(['Creator'])
    editContent(
        @AuthUser() authUser: UserEntity,
        @Args('input') editContentInput: EditContentInput,
    ): Promise<EditContentOutput> {
        return this.contentService.editContent(authUser, editContentInput)
    }

    @Mutation(returns => DeleteContentOutput)
    @Role(['Creator'])
    deleteContent(
        @AuthUser() authUser: UserEntity,
        @Args('input') deleteContentInput: DeleteContentInput
    ): Promise<DeleteContentOutput> {
        return this.contentService.deleteContent(authUser, deleteContentInput)
    }
}