import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';
import { KakaoStrategy } from './passport/kakao.strategy';

@Module({
	imports: [
		PassportModule.register({
			session: true,
			// defaultStrategy: "jwt"
		}),
		// JwtModule.register({
		//     secretOrPrivateKey: "secretKey",
		// }),
		TypeOrmModule.forFeature([UserEntity]),
	],
	controllers: [AuthController],
	providers: [AuthService, KakaoStrategy, LocalSerializer, LocalStrategy],
})
export class AuthModule {}
