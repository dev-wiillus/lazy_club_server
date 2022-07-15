import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { ChannelEntity } from "../entities/channel.entity";

@InputType()
export class CreateChannelDto extends OmitType(ChannelEntity, ['id', 'createTime', 'main_content_id',], InputType) { }
