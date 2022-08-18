import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class KakaoStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			clientID: process.env.KAKAO_ID,
			callbackURL: '/auth/kakao/callback',
		});
	}

	async validate(
		accessToken,
		refreshToken,
		profile,
		done: CallableFunction,
	): Promise<any> {
		const profileJson = profile._json;
		const kakao_account = profileJson.kakao_account;
		const payload = {
			name: kakao_account.profile.nickname,
			kakaoId: profileJson.id,
			email: kakao_account.email,
		};

		done(null, payload);
	}
}
