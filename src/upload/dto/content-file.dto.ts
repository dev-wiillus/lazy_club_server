import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { ContentEntity } from '@root/content/entities/content.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CoreOutput } from 'src/common/dto/output.dto';
import { ContentFileEntity } from 'src/content/entities/content_file.entity';
import { UploadFileOutput } from './upload-file.dto';

@InputType()
export class CreateContentFileInput extends PickType(
	ContentFileEntity,
	['isPreview'],
	InputType,
) {
	@Field((type) => Number)
	contentId: number;

	@Field((type) => GraphQLUpload)
	file: FileUpload;
}

@ObjectType()
export class CreateContentFileOutput extends CoreOutput {
	@Field((type) => ContentFileEntity, { nullable: true })
	result?: ContentFileEntity;
}

@InputType()
export class EditContentFileInput extends PickType(
	ContentFileEntity,
	['id'],
	InputType,
) {
	@Field((type) => GraphQLUpload)
	file: FileUpload;
}

@ObjectType()
export class EditContentFileOutput extends CreateContentFileOutput {}

@InputType()
export class ContentUploadFileInput {
	@Field((type) => ContentEntity)
	content: ContentEntity;

	@Field((type) => GraphQLUpload)
	file: FileUpload;
}

@ObjectType()
export class ContentUploadFileOutput extends UploadFileOutput {}
