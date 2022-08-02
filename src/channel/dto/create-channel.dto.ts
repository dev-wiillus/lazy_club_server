import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { CoreOutput } from "src/common/dto/output.dto";
import { ChannelEntity } from "../entities/channel.entity";
import { ChannelOperatorEntity } from "../entities/channel_operator.entity";

@InputType()
export class CreateChannelInput extends PickType(ChannelEntity, [
    'title',
    'subject',
    'description',
    'thumbnail',
    'mainContentId',
], InputType) {
    @Field(type => Int)
    tagId?: number;
 }

@ObjectType()
export class CreateChannelOutput extends CoreOutput { }


@InputType()
export class InviteChannelOperatorInput {
    @Field(type => [String])
    // TODO @IsEmail() array에 적용되도록
    emails?: (string | undefined)[]
}


@InputType()
export class CreateChannelOperatorInput extends PickType(ChannelOperatorEntity, [
    'userId',
    'channelId',
    'returnAccount',
    'businessRegistrationNumber'
], InputType) { }

@ObjectType()
export class CreateChannelOperatorOutput extends CoreOutput { }
