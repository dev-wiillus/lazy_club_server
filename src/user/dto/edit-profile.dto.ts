import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CoreOutput } from 'src/common/dto/output.dto';
import { UserEntity } from '../entities/user.entity';

@ObjectType()
class ResultOutput extends PartialType(UserEntity, ObjectType) {
	@Field(type => Boolean, { nullable: true })
	hasChannel?: boolean;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {
	@Field((type) => ResultOutput, { nullable: true })
	result?: ResultOutput;
}

@InputType()
export class EditProfileInput {
	@Field((type) => GraphQLUpload, { nullable: true })
	profile?: FileUpload;

	@Field((type) => String, { nullable: true })
	password?: string;

	@Field((type) => String, { nullable: true })
	nickname?: string;

	@Field((type) => String, { nullable: true })
	name?: string;
}
