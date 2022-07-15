import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import passport from 'passport';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }

    // async validateUser(email: string, password: string) {
    //     const user = await this.userRepository.findOne({
    //         where: { email }
    //     })
    //     if (!user) return null;

    //     const result = await bcrypt.compare(password, user.password);
    //     if (result) {
    //         const { password, ...others } = user;
    //         return others
    //     }
    // }

    async login(params: Pick<UserEntity, 'email' | 'password'>): Promise<UserEntity> {
        /* SNS 로그인 */
        return
    }

    async logout(): Promise<{ ok: boolean }> {
        /* SNS 로그아웃 */
        return
    }

    async kakao() {
        /* 카카오 인증 */
        passport.authenticate('kakao')
    }
}
