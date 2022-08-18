import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.get<AllowedRoles>(
			'roles',
			context.getHandler(),
		);
		if (!roles) {
			// role x -> 누구나 접근 가능
			return true;
		}
		const gqlContext = GqlExecutionContext.create(context).getContext();
		const user = gqlContext['user'];
		if (!user) {
			// 로그인 x -> 진행 불가
			return false;
		}
		// 유저의 role에 따라 접근 가능 여부 결정
		return roles.includes(user.role);
	}
}
