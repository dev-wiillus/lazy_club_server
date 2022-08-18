import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { ChannelEntity } from '../entities/channel.entity';

@InputType()
export class FindChannelInput {
	@Field((type) => Int, { nullable: true })
	channelId?: number;

	@Field((type) => Int, { nullable: true })
	userId?: number;
}

@ObjectType()
export class FindChannelOutput extends CoreOutput {
	@Field((type) => ChannelEntity, { nullable: true })
	results?: ChannelEntity;
}
