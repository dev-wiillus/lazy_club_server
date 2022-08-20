import { UseGuards } from '@nestjs/common';
import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { Role } from 'src/auth-local/role.decorator';
import { AuthUser } from 'src/auth-local/auth-user.decorator';
import { AuthGuard } from 'src/auth-local/auth.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { RegisterInput, RegisterOutput } from './dto/register.dto';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verity-email.dto';
import { UserService } from './user.service';

@Resolver((of) => UserEntity)
export class UserResolver {
	constructor(private readonly userService: UserService) { }

	@ResolveField((type) => Boolean)
	hasChannel(@Parent() user: UserEntity): Promise<boolean> {
		return this.userService.checkOwnChannel(user.id);
	}

	@Query((returns) => [UserEntity])
	findAll(id: number): Promise<UserEntity[]> {
		return this.userService.findAll();
	}

	@Query((returns) => UserProfileOutput)
	findOne(id: number): Promise<UserProfileOutput> {
		return this.userService.findOne(id);
	}

	@Mutation((returns) => RegisterOutput)
	registerUser(
		@Args('input') registerInput: RegisterInput,
	): Promise<RegisterOutput> {
		return this.userService.register(registerInput);
	}

	@Mutation((returns) => LoginOutput)
	login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
		return this.userService.login(loginInput);
	}

	@Query((returns) => UserEntity)
	@Role(['User', 'Creator'])
	me(@AuthUser() authUser: UserEntity) {
		return authUser;
	}

	@Query((returns) => UserProfileOutput)
	@Role(['User', 'Creator'])
	userProfile(
		@Args() userProfileInput: UserProfileInput,
	): Promise<UserProfileOutput> {
		return this.userService.findOne(userProfileInput.userId);
	}

	@Mutation((returns) => EditProfileOutput)
	@Role(['User', 'Creator'])
	editProfile(
		@AuthUser() authUser: UserEntity,
		@Args('input') editProfileInput: EditProfileInput,
	): Promise<EditProfileOutput> {
		return this.userService.editProfile(authUser.id, editProfileInput);
	}

	@Mutation((returns) => VerifyEmailOutput)
	verifyEmail(@Args('input') verifyEmailInput: VerifyEmailInput) {
		return this.userService.verifyEmail(verifyEmailInput.code);
	}
}
