import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { ChannelTagEntity } from "../entities/channel_tag.entity";


@InputType()
export class CategoryInput {
    @Field(type => [String])
    tags: String[]
}

@ObjectType()
export class CategoryOutput extends CoreOutput {
    @Field(type => ChannelTagEntity, { nullable: true })
    tags?: ChannelTagEntity;
}