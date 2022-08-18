import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
	constructor(
		private readonly authService: AuthService,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	) {
		super();
	}

	serializeUser(user: UserEntity, done: CallableFunction) {
		done(null, user.id);
	}

	async deserializeUser(userId: string, done: CallableFunction) {
		return await this.userRepository
			.findOneOrFail({
				where: { id: +userId },
				select: ['id', 'email', 'name'],
			})
			.then((user) => {
				done(null, user);
			})
			.catch((error) => done(error));
	}
}
