import { Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(+id);
	}

	@Post()
	register(@Body() user: UserEntity) {
		return this.userService.register(user);
	}

	@Delete(':id')
	deleteAccount(@Param('id') id: number) {
		return this.userService.deleteAccount(id);
	}

	@Get(':id')
	findPayment(@Param('id') id: string) {
		return this.userService.findPayment(+id);
	}
}
