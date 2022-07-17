import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelResolver } from './channel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from './entities/channel.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelBillingPolicyEntity } from './entities/channel_billing_policy.entity';
import { ChannelCategoryEntity } from './entities/channel_category.entity';
import { ChannelOperatorEntity } from './entities/channel_operator.entity';
import { ChannelTagEntity } from './entities/channel_tag.entity';
import { CommunityEntity } from './entities/community.entity';
import { OpenAlertEntity } from './entities/open_alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelEntity,
       UserEntity,
        ChannelBillingPolicyEntity,
      ChannelCategoryEntity,
      ChannelOperatorEntity,
      ChannelTagEntity,
      CommunityEntity,
      OpenAlertEntity
      ]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelResolver]
})
export class ChannelModule { }
