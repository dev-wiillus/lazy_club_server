import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { ContentEntity } from '../entities/content.entity';

@InputType()
export class FindContentInput {
	@Field((type) => Int, { nullable: true })
	contentId?: number;

	@Field((type) => Int, { nullable: true })
	channelId?: number;
}

@ObjectType()
export class FindContentOutput extends CoreOutput {
	@Field((type) => ContentEntity, { nullable: true })
	results?: ContentEntity;
}
