import { Field, InputType, Int, ObjectType, OmitType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { ContentEntity } from "../entities/content.entity";

@InputType()
export class FindContentInput {
    @Field(type => Int)
    contentId: number;
}

@ObjectType()
export class FindContentOutput extends CoreOutput {
    @Field(type => ContentEntity, { nullable: true })
    results?: ContentEntity;
}