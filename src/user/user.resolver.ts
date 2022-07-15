import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth-local/auth-user.decorator";
import { AuthGuard } from "src/auth-local/auth.guard";
import { UserEntity } from "src/user/entities/user.entity";
import { EditProfileInput, EditProfileOutput } from "./dto/edit-profile.dto";
import { LoginInput, LoginOutput } from "./dto/login.dto";
import { RegisterInput, RegisterOutput } from "./dto/register.dto";
import { UserProfileInput, UserProfileOutput } from "./dto/user-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "./dto/verity-email.dto";
import { UserService } from "./user.service";


@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(returns => [UserEntity])
    findAll(id: number): Promise<UserEntity[]> {
        return this.userService.findAll();
    }

    @Query(returns => UserProfileOutput)
    findOne(id: number): Promise<UserProfileOutput> {
        return this.userService.findOne(id);
    }

    @Mutation(returns => RegisterOutput)
    register(@Args("input") registerInput: RegisterInput): Promise<RegisterOutput> {
        return this.userService.register(registerInput)
    }

    @Mutation(returns => LoginOutput)
    login(@Args("input") loginInput: LoginInput): Promise<LoginOutput> {
        return this.userService.login(loginInput)
    }

    @Query(returns => UserEntity)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: UserEntity) {
        return authUser
    }

    @UseGuards(AuthGuard)
    @Query(returns => UserProfileOutput)
    userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        return this.userService.findOne(userProfileInput.userId)
    }

    @UseGuards(AuthGuard)
    @Mutation(returns => EditProfileOutput)
    editProfile(
        @AuthUser() authUser: UserEntity,
        @Args('input') editProfileInput: EditProfileInput
    ): Promise<EditProfileOutput> {
        return this.userService.editProfile(authUser.id, editProfileInput)
    }

    @Mutation(returns => VerifyEmailOutput)
    verifyEmail(@Args('input') verifyEmailInput: VerifyEmailInput) {
        return this.userService.verifyEmail(verifyEmailInput.code)
    }
}