import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelResolver } from './channel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from './entities/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelResolver]
})
export class ChannelModule { }
