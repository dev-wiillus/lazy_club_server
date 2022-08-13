import { Field, InputType, ObjectType, OmitType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { ContentEntity } from "../entities/content.entity";

@InputType()
export class CreateContentInput extends PickType(ContentEntity, [
    'title',
    'category',
    'content',
    'status'
], InputType) {
    @Field(type => Number)
    channelId: number;
}

@ObjectType()
export class CreateContentOutput extends CoreOutput {
    @Field(type => ContentEntity, { nullable: true })
    results?: ContentEntity
}