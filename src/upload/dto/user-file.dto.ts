import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '@root/user/entities/user.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { UploadFileOutput } from './upload-file.dto';

@InputType()
export class UploadUserFileInput {
	@Field((type) => UserEntity)
	user: UserEntity;

	@Field((type) => GraphQLUpload)
	file: FileUpload;
}

@ObjectType()
export class UploadUserFileOutput extends UploadFileOutput {}
