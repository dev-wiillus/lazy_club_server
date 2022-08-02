import { Field, InputType, Int, ObjectType, ResolveField } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { PaginationInput, PaginationOutput } from "src/common/dto/pagination.dto";
import { ChannelEntity } from "../entities/channel.entity";

@InputType()
export class FindAllChannelInput extends PaginationInput { }

@ObjectType()
export class FindAllChannelOutput extends PaginationOutput {
    @Field(type => [ChannelEntity], { nullable: true })
    results?: ChannelEntity[];
}