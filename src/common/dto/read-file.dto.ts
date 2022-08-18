import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';

@InputType()
export class ReadFileInput {
	@Field((type) => String)
	path: string;
}

@ObjectType()
export class ReadFileOutput extends CoreOutput {
	@Field((type) => String, { nullable: true })
	result?: string;
}
