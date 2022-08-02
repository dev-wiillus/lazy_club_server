import { Field, InputType, PartialType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { ChannelOperatorEntity } from '../entities/channel_operator.entity';
import { CreateChannelInput } from './create-channel.dto';

@InputType()
export class EditChannelInput extends PartialType(CreateChannelInput) {
    @Field(type => Number)
    channelId: number;
}

@ObjectType()
export class EditChannelOutput extends CoreOutput { }

@InputType()
export class EditChannelOperatorInput extends PartialType(
    PickType(ChannelOperatorEntity, [
        'returnAccount',
        'businessRegistrationNumber',
    ], InputType)
) { }

@ObjectType()
export class EditChannelOperatorOutput extends CoreOutput { }