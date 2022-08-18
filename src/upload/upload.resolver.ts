import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
	UploadChannelFileInput,
	UploadChannelFileOutput,
} from './dto/channel-file.dto';
import {
	CreateContentFileInput,
	CreateContentFileOutput,
} from './dto/content-file.dto';
import { UploadUserFileInput, UploadUserFileOutput } from './dto/user-file.dto';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
	constructor(private readonly uploadService: UploadService) {}

	@Mutation(() => CreateContentFileOutput)
	async createContentFile(
		@Args('input') contentFileInput: CreateContentFileInput,
	): Promise<CreateContentFileOutput> {
		return this.uploadService.createContentFile(contentFileInput);
	}

	@Mutation(() => UploadUserFileOutput)
	async uploadUserFile(
		@Args('input') uploadUserFileInput: UploadUserFileInput,
	): Promise<UploadUserFileOutput> {
		return this.uploadService.userProfileUploadFile(uploadUserFileInput);
	}

	@Mutation(() => UploadChannelFileOutput)
	async uploadChannelFile(
		@Args('input') uploadChannelFileInput: UploadChannelFileInput,
	): Promise<UploadChannelFileOutput> {
		return this.uploadService.channelProfileUploadFile(uploadChannelFileInput);
	}
}
