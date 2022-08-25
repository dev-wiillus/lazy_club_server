import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsString } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export enum SNSCategory {
	KAKAO = 'kakao',
	NAVER = 'naver',
	GOOGLE = 'google'
}

registerEnumType(SNSCategory, { name: 'SNSCategory' })

@InputType('SNSInfoInput')
@ObjectType('SNSInfoOutput')
@Entity('SNSInfo')
export class SNSInfoEntity {
	/*
		유저 SNS 연동 정보
	*/
	@Field((type) => Number)
	@PrimaryGeneratedColumn()
	id: number;

	@Field((type) => String)
	@Column({ length: 45, comment: 'SNS ID' })
	@IsString()
	snsId: string;

	@Field((type) => SNSCategory)
	@Column({
		comment: 'SNS 종류',
		type: 'enum',
		enum: SNSCategory,
	})
	@IsEnum(SNSCategory)
	snsCategory: string;

	@Field((type) => String)
	@Column({ length: 45, comment: 'SNS 이름' })
	@IsString()
	snsName: string;

	@Field((type) => String)
	@Column({ length: 200, comment: 'SNS 프로필' })
	@IsString()
	snsProfile: string;

	@Field((type) => Date)
	@CreateDateColumn({ comment: 'SNS 연동 날짜' })
	@IsDate()
	snsConnectedDate: Date;

	@Field((type) => UserEntity)
	@ManyToOne((type) => UserEntity, (user) => user.sns)
	user: UserEntity;
}
