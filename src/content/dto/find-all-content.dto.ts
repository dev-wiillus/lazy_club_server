import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dto/pagination.dto";
import { ContentEntity } from "../entities/content.entity";

@InputType()
export class FindAllContentInput extends PaginationInput {
    @Field(type => Int)
    channelId: number;

    @Field(type => String, { nullable: true })
    title?: string;
}

@ObjectType()
export class FindAllContentOutput extends PaginationOutput {
    @Field(type => [ContentEntity], { nullable: true })
    results?: ContentEntity[];
}