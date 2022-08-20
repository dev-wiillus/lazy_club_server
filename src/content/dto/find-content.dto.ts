import { Field, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { ContentEntity } from '../entities/content.entity';
import { ContentFileEntity } from '../entities/content_file.entity';

@InputType()
export class FindContentInput {
	@Field((type) => Int, { nullable: true })
	contentId?: number;

	@Field((type) => Int, { nullable: true })
	channelId?: number;
}

@ObjectType()
class ContentEntityOutput extends ContentEntity {
	@Field(type => String, { nullable: true })
	previewImage?: string;

	@Field(type => String, { nullable: true })
	previewImageUrl?: string;
}

@ObjectType()
export class FindContentOutput extends CoreOutput {
	@Field((type) => ContentEntityOutput, { nullable: true })
	results?: ContentEntityOutput;
}
