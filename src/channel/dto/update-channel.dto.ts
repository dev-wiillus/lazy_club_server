import { Field, InputType, PickType, PartialType } from '@nestjs/graphql';
import { ChannelEntity } from '../entities/channel.entity';
import { CreateChannelDto } from './create-channel.dto';

@InputType()
class UpdateChannelInputType extends PartialType(CreateChannelDto) { }

@InputType()
export class UpdateChannelDto extends PickType(ChannelEntity, ['id'], InputType) {

    @Field(type => UpdateChannelInputType)
    data: UpdateChannelInputType
}
