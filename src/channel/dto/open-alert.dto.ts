import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { OpenAlertEntity } from '../entities/open_alert.entity';

@ObjectType()
export class OpenAlertOutput extends CoreOutput {}

@InputType()
export class OpenAlertInput extends PickType(
	OpenAlertEntity,
	['name', 'phone'],
	InputType,
) {
	@Field((type) => Int)
	channelId: number;
}

@InputType()
export class CheckOpenAlertInput {
	@Field((type) => Int)
	channelId: number;
}
