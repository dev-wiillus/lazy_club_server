import { Module } from '@nestjs/common';
import { CommonResolver } from './common.resolver';
import { CommonService } from './common.service';

@Module({
	providers: [CommonResolver, CommonService],
	exports: [CommonService],
})
export class CommonModule {}
