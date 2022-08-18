import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class UploadFileInput {
	@Field((type) => String, { nullable: true })
	dirPath?: string;

	@Field((type) => GraphQLUpload)
	file: FileUpload;
}

@ObjectType()
export class UploadFileOutput extends CoreOutput {
	@Field((type) => String, { nullable: true })
	filePath?: string;
}
