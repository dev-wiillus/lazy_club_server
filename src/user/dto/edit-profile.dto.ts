import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CoreOutput } from 'src/common/dto/output.dto';
import { UserEntity } from '../entities/user.entity';

@ObjectType()
export class EditProfileOutput extends CoreOutput {
	@Field((type) => UserEntity, { nullable: true })
	result?: UserEntity;
}

@InputType()
export class EditProfileInput {
	@Field((type) => GraphQLUpload, { nullable: true })
	profile?: FileUpload;

	@Field((type) => String, { nullable: true })
	password?: string;

	@Field((type) => String, { nullable: true })
	nickname?: string;
}
