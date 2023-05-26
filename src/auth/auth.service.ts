import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { KakaoInput, KakaoOutput } from './dto/kakao.dto';
import { SNSCategory, SNSInfoEntity } from '@root/user/entities/sns_info.entity';
import { CommonService } from '@root/common/common.service';
import { JwtService } from '@root/jwt/jwt.service';
import { JwtModuleOptions } from '@nestjs/jwt';
import { CONFIG_OPTIONS } from '@root/common/common.constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
	constructor(
		// @Inject(CONFIG_OPTIONS)
		// private readonly options: JwtModuleOptions,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(SNSInfoEntity)
		private readonly snsInfoRepository: Repository<SNSInfoEntity>,
		private readonly commonService: CommonService,
		private readonly jwtService: JwtService,
	) { }
	// signAccessToken(
	// 	userId: number,
	// ): string {
	// 	return jwt.sign({ id: userId }, this.options.accessTokenPrivateKey, {
	// 		expiresIn: '1h',
	// 	});
	// }

	// signRefreshToken(
	// 	userId: number,
	// ): string {
	// 	return jwt.sign({ id: userId }, this.options.refreshTokenPrivateKey, {
	// 		expiresIn: '24h',
	// 	});
	// }

	// verifyAccessToken(token: string) {
	// 	return jwt.verify(token, this.options.accessTokenPrivateKey);
	// }

	// verifyRefreshToken(token: string) {
	// 	return jwt.verify(token, this.options.refreshTokenPrivateKey);
	// }

	async kakao({ name, kakaoId, email, nickname, profile }: KakaoInput): Promise<KakaoOutput> {
		/* 카카오 인증 */
		// passport.authenticate('kakao');
		console.log('--------------------------service')
		const user = await this.snsInfoRepository.findOne({
			where: {
				snsCategory: SNSCategory.KAKAO,
				snsId: kakaoId
			}
		})
		if (user) {
			const token = this.jwtService.sign({ id: user.id });
			return {
				ok: true,
				token
			}
		} else {
			try {
				const password = this.commonService.generate_temp_password()
				const newUser = this.userRepository.create({
					email,
					name,
					nickname,
					profile,
					password
				})
				// TODO: 비번은 어떻게 세팅? 이후 해당 정보 바탕으로 로컬 로그인 가능하게?
				await this.userRepository.save(newUser)

				const newSNS = this.snsInfoRepository.create({
					snsId: kakaoId,
					snsCategory: SNSCategory.KAKAO,
					snsName: name,
					snsProfile: profile,
					user: newUser
				})
				await this.snsInfoRepository.save(newSNS)

				const token = this.jwtService.sign({ id: newUser.id });
				return {
					ok: true,
					token
				}
			} catch (error) {
				return {
					ok: false,
					error
				}
			}
		}
	}
}
