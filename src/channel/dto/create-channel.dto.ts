import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { CoreOutput } from "src/common/dto/output.dto";
import { ChannelEntity } from "../entities/channel.entity";
import { ChannelOperatorEntity } from "../entities/channel_operator.entity";
// import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreateChannelInput extends PickType(ChannelEntity, [
    'title',
    'description',
    'mainContentId',
    'thumbnail',
    'agentIntroduction',
    'termsOfService',
    'agreements'
], InputType) {
    @Field(type => Int)
    tagId?: number;

    // @Field(type => GraphQLUpload)
    // thumbnail?: FileUpload
}

@ObjectType()
export class CreateChannelOutput extends CoreOutput {
    @Field(type => ChannelEntity, { nullable: true })
    result?: ChannelEntity;
}


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
