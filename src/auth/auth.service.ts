import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { KakaoInput, KakaoOutput } from './dto/kakao.dto';
import { SNSCategory, SNSInfoEntity } from '@root/user/entities/sns_info.entity';
import { CommonService } from '@root/common/common.service';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(SNSInfoEntity)
		private readonly snsInfoRepository: Repository<SNSInfoEntity>,
		private readonly commonService: CommonService,
	) { }

	async login(
		params: Pick<UserEntity, 'email' | 'password'>,
	): Promise<UserEntity> {
		/* SNS 로그인 */
		return;
	}

	async logout(): Promise<{ ok: boolean }> {
		/* SNS 로그아웃 */
		return;
	}

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
			return {
				ok: true
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
				return { ok: true }
			} catch (error) {
				return {
					ok: false,
					error
				}
			}
		}
	}
}
