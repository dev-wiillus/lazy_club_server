import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput, OptionOutput } from "src/common/dto/output.dto";
import { ChannelCategoryEntity } from "../entities/channel_category.entity";
import { ChannelTagEntity } from "../entities/channel_tag.entity";

@ObjectType()
export class FindChannelTagOutput extends CoreOutput {
    @Field(type => [OptionOutput], { nullable: true })
    results?: OptionOutput[];
}

@InputType()
export class FindTagByChannelIdInput {
    @Field(type => Int)
    channelId: number;
}

@ObjectType()
export class FindTagByChannelIdOutput extends CoreOutput {
    @Field(type => ChannelTagEntity, { nullable: true })
    results?: ChannelTagEntity;
}

@InputType()
export class MutateChannelCategoryInput {
    @Field(type => Int)
    tagId: number;

    @Field(type => Int)
    channelId: number;
}

@ObjectType()
export class MutateChannelCategoryOutput extends CoreOutput {
    @Field(type => ChannelCategoryEntity)
    results?: ChannelCategoryEntity;
}