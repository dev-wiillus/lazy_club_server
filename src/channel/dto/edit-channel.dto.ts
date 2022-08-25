import {
	Field,
	InputType,
	PartialType,
	ObjectType,
	PickType,
} from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CoreOutput } from 'src/common/dto/output.dto';
import { ChannelEntity } from '../entities/channel.entity';
import { ChannelOperatorEntity } from '../entities/channel_operator.entity';
import { CreateChannelInput } from './create-channel.dto';

@InputType()
export class EditChannelInput extends PartialType(PickType(
	CreateChannelInput,
	['title', 'description'],
	InputType)) {
	@Field((type) => Number)
	channelId: number;

	@Field((type) => GraphQLUpload, { nullable: true })
	thumbnail?: FileUpload;
}

@ObjectType()
export class EditChannelOutput extends CoreOutput {
	@Field((type) => ChannelEntity, { nullable: true })
	result?: ChannelEntity;
 }

@InputType()
export class EditChannelOperatorInput extends PartialType(
	PickType(
		ChannelOperatorEntity,
		['returnAccount', 'businessRegistrationNumber'],
		InputType,
	),
) { }

@ObjectType()
export class EditChannelOperatorOutput extends CoreOutput { }
