import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class KakaoStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			clientID: process.env.KAKAO_ID,
			callbackURL: process.env.KAKAO_CALLBACK_URL,
		});
	}

	async validate(
		accessToken,
		refreshToken,
		profile,
		done: CallableFunction,
	): Promise<any> {
		console.log('--------------------------strategy')
		const profileJson = profile._json;
		const kakao_account = profileJson.kakao_account;
		const payload = {
			name: kakao_account.profile.nickname,
			kakaoId: profileJson.id,
			email: kakao_account.has_email
				? kakao_account.email : null,
			profile: kakao_account.profile.profile_image_url,
			nickname: kakao_account.profile.nickname,
			accessToken
		};

		done(null, payload);
	}
}
