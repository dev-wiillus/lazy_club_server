import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ChannelEntity } from '@root/channel/entities/channel.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { UploadFileOutput } from './upload-file.dto';

@InputType()
export class UploadChannelFileInput {
	@Field((type) => ChannelEntity)
	channel: ChannelEntity;

	@Field((type) => GraphQLUpload)
	file: FileUpload;
}

@ObjectType()
export class UploadChannelFileOutput extends UploadFileOutput {}
