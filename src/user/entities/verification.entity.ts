import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import { IsString } from 'class-validator';

@InputType('VerificationInput')
@ObjectType('VerificationOutput')
@Entity('Verification')
export class VerificationEntity extends CoreEntity {
	@Column()
	@Field((type) => String)
	@IsString()
	code: string;

	@OneToOne((type) => UserEntity, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: UserEntity;

	@BeforeInsert()
	createCode(): void {
		this.code = uuidv4();
	}
}
