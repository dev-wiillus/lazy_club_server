import {
	Field,
	InputType,
	ObjectType,
	PartialType,
	PickType,
} from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ContentEntity } from '../entities/content.entity';
import { CreateContentOutput } from './create-content.dto';

@InputType()
export class EditContentInput extends PickType(
	ContentEntity,
	['id', 'title', 'status'],
	InputType,
) {
	@Field((type) => GraphQLUpload, { nullable: true })
	previewImage?: FileUpload;

	@Field((type) => GraphQLUpload)
	content: FileUpload;
}

@ObjectType()
export class EditContentOutput extends CreateContentOutput {}
