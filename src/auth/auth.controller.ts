import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorator/auth.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoggedInGuard } from './logged-in.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	logIn(@User() user) {
		return user;
	}

	@UseGuards(LoggedInGuard)
	@Get('logout')
	logOut() {
		return this.authService.logout();
	}

	@Get('naver')
	authNaver() {
		return;
	}

	@Get('kakao')
	@HttpCode(200)
	@UseGuards(AuthGuard('kakao'))
	authKakao() {
		return HttpStatus.OK;
	}

	@Get('kakao/callback')
	@HttpCode(200)
	@UseGuards(AuthGuard('kakao'))
	authKakaoCallback() {
		return this.authService.kakao;
	}

	@Get('google')
	authGoogle() {}
}
