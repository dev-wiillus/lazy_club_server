import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';
import { KakaoStrategy } from './passport/kakao.strategy';
import { SNSInfoEntity } from '@root/user/entities/sns_info.entity';
import { JwtStrategy } from './jwt/jwt.strategy';
import { jwtConstants } from './constants';

@Module({
	imports: [
		PassportModule.register({
			session: true,
			// defaultStrategy: "jwt"
		}),
		JwtModule.register({
			secretOrPrivateKey: jwtConstants.secret,
		}),
		TypeOrmModule.forFeature([UserEntity, SNSInfoEntity]),
		CommonModule
	],
	controllers: [AuthController],
	providers: [AuthService, KakaoStrategy, JwtStrategy],
})
export class AuthModule { }
