import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";


@InputType()
export class DeleteChannelInput {
    @Field(type => Number)
    channelId: number;
}

@ObjectType()
export class DeleteChannelOutput extends CoreOutput { }