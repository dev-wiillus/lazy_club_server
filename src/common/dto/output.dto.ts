import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
	@Field((type) => String, { nullable: true })
	error?: string;

	@Field((type) => Boolean)
	ok: boolean;
}

@ObjectType()
export class OptionOutput {
	@Field((type) => Int)
	value: number;

	@Field((type) => String)
	label: string;
}
