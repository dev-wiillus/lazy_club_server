import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { RegisterInput, RegisterOutput } from "./dto/register.dto";
import { LoginInput, LoginOutput } from "./dto/login.dto";
import { JwtService } from "src/jwt/jwt.service";
import { number } from "joi";
import { EditProfileInput, EditProfileOutput } from "./dto/edit-profile.dto";
import { VerificationEntity } from "./entities/verification.entity";
import { UserProfileOutput } from "./dto/user-profile.dto";
import { VerifyEmailOutput } from "./dto/verity-email.dto";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(VerificationEntity)
        private readonly verificationRepository: Repository<VerificationEntity>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
    ) { }

    async findAll(): Promise<UserEntity[]> {
        return this.userRepository.find()
    }

    async findOne(id: number): Promise<UserProfileOutput> {
        try {

            const user = await this.userRepository.findOne({ where: { id } })
            if (user) {
                return {
                    ok: true,
                    user: user
                }
            }

        } catch (error) {
            return {
                ok: false,
                error: "계정을 찾을 수 없습니다."
            }
        }
    }

    async register(params: RegisterInput): Promise<RegisterOutput> {
        /* SNS 회원가입 */
        try {
            // check new user
            const newUser = await this.userRepository.findOne({ where: { email: params.email } })
            if (newUser) {
                return { ok: false, error: "이미 가입된 이메일입니다." }
            }
            // create user
            const user = await this.userRepository.save(
                this.userRepository.create({
                    ...params,
                })
            )
            const verification = await this.verificationRepository.save(
                this.verificationRepository.create({
                    user
                }))
            this.mailService.sendVerificationEmail(user.email, verification.code)
            return { ok: true }
        } catch (e) {
            return { ok: false, error: "계정을 생성할 수 없습니다." }
        }
    }

    async deleteAccount(id: number): Promise<UserEntity> {
        /* SNS 회원 탈퇴 */
        return
    }

    async findPayment(id: number) {
        /* 결제 로그 조회 */
        return
    }

    async login({
        email, password
    }: LoginInput): Promise<LoginOutput> {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                select: ["id", "password"]
            })
            if (!user) return {
                ok: false,
                error: '일치하는 정보를 찾을 수 없습니다.'
            }
            const passwordCorrect = await user.checkPassword(password)
            if (!passwordCorrect) return {
                ok: false,
                error: '일치하는 정보를 찾을 수 없습니다.'
            }

            const token = this.jwtService.sign({ id: user.id })
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

    async editProfile(userId: number, { email, password }: EditProfileInput): Promise<EditProfileOutput> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } })
            if (email) {
                user.email = email
                user.verified = false
                const verification = await this.verificationRepository.save(
                    this.verificationRepository.create({ user })
                )
                this.mailService.sendVerificationEmail(user.email, verification.code)
            }
            if (password) user.password = password
            await this.userRepository.save(user)
            return {
                ok: true
            }
        } catch (error) {
            return {
                ok: false,
                error: "계정 정보를 수정할 수 없습니다."
            }
        }
    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        try {

            const verification = await this.verificationRepository.findOne({
                where: { code },
                relations: ["user"]
            })
            if (verification) {
                verification.user.verified = true;
                await this.userRepository.save(verification.user)
                await this.verificationRepository.delete(verification.id)
                return { ok: true }
            }
            throw new Error("verification not found.")

        } catch (error) {
            return { ok: false, error }
        }
    }
}