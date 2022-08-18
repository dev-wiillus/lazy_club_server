import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeleteContentInput {
	@Field((type) => Number)
	contentId: number;
}

@ObjectType()
export class DeleteContentOutput extends CoreOutput {}
