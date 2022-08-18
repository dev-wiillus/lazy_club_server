import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from '@root/channel/entities/channel.entity';
import { UserEntity } from '@root/user/entities/user.entity';
import { ContentEntity } from 'src/content/entities/content.entity';
import { ContentFileEntity } from 'src/content/entities/content_file.entity';
import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ContentFileEntity,
			ContentEntity,
			UserEntity,
			ChannelEntity,
		]),
	],
	providers: [UploadResolver, UploadService],
	exports: [UploadService],
})
export class UploadModule {}
