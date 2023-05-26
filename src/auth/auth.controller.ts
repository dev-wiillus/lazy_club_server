import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Redirect,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from 'src/common/decorator/auth.decorator';
import { AuthService } from './auth.service';
import { KakaoInput } from './dto/kakao.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { LoggedInGuard } from './logged-in.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	// @UseGuards(LocalAuthGuard)
	// @Post('login')
	// logIn(@User() user) {
	// 	return user;
	// }

	// @UseGuards(LoggedInGuard)
	// @Get('logout')
	// logOut() {
	// 	return this.authService.logout();
	// }

	@Get('naver')
	authNaver() {
		return;
	}

	@Get('/kakao')
	@HttpCode(200)
	@UseGuards(AuthGuard('kakao'))
	async authKakao() {
		console.log('---0----------------')
		return HttpStatus.OK;
	}

	@Get('/kakao/callback')
	// @Redirect('http://localhost:3000/')
	// @Redirect('http://localhost:3000/sign-in')
	@UseGuards(AuthGuard('kakao'))
	async authKakaoCallback(
		@Req() req: Request,
		@Res() res: Response
	): Promise<any> {
		console.log('--------------------------controller')
		const result = await this.authService.kakao(req.user as KakaoInput);
		return res.status(HttpStatus.OK).setHeader('x-jwt', result.token).json({ token: result.token }).redirect('http://localhost:3000/auth/kakao/callback')
		// res.json({ test: 'tttt' }).redirect('http://localhost:3000/sign-in')
		// if (result.ok) {
		// 	return {
		// 		access_token: req.user.accessToken
		// 	}
		// }
		// return res.status(HttpStatus.OK).json({ access_token: req.user.accessToken })
		// return req
	}

	@Get('google')
	authGoogle() { }
}
