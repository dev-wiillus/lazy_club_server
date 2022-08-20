import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthorizationPolicyEntity } from './entities/authorization_policy.entity';
import { AgreementLogEntity } from './entities/agreement_log.entity';
import { SNSInfoEntity } from './entities/sns_info.entity';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { VerificationEntity } from './entities/verification.entity';
import { SubscriptionEntity } from './entities/subscription.entity';
import { UploadModule } from '@root/upload/upload.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			AuthorizationPolicyEntity,
			AgreementLogEntity,
			SNSInfoEntity,
			VerificationEntity,
			SubscriptionEntity,
		]),
		UploadModule,
	],
	controllers: [UserController],
	providers: [UserService, UserResolver],
	exports: [UserService],
})
export class UserModule { }
