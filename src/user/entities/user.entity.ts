import {
	Field,
	InputType,
	ObjectType,
	registerEnumType,
} from '@nestjs/graphql';
import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
} from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { AgreementLogEntity } from './agreement_log.entity';
import { AuthorizationPolicyEntity } from './authorization_policy.entity';
import { SNSInfoEntity } from './sns_info.entity';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { ChannelOperatorEntity } from 'src/channel/entities/channel_operator.entity';

enum UserStatus {
	DELETED = 'deleted', // 탈퇴
	RUNNING = 'running', // 사용중
	PENDING = 'pending', // 승인 대기
}

registerEnumType(UserStatus, { name: 'UserStatusType' });

export enum UserRole {
	User = 'User', // 일반 사용자
	Creator = 'Creator', // 채널 운영자
}

registerEnumType(UserRole, { name: 'UserRoleType' });

@InputType('UserInput')
@ObjectType('UserOutput')
@Entity('User')
export class UserEntity extends CoreEntity {
	/* 
		유저
	*/

	@Field((type) => String, { nullable: true })
	@Column({ length: 200, nullable: true })
	@IsString()
	@IsOptional()
	name?: string;

	@Field((type) => String, { nullable: true })
	@Column({ length: 20, nullable: true })
	@IsString()
	@IsOptional()
	phone?: string;

	@Field((type) => String)
	@Column({ length: 200, unique: true })
	@IsEmail()
	email: string;

	@Field((type) => String)
	@Column({ length: 100, select: false })
	@IsString()
	password: string;

	@Field((type) => String, { nullable: true })
	@Column({ length: 200, nullable: true })
	@IsString()
	@IsOptional()
	nickname?: string;

	@Field((type) => UserStatus, { defaultValue: UserStatus.PENDING })
	@Column({
		comment: '계정 상태',
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.PENDING,
	})
	@IsEnum(UserStatus)
	@IsOptional()
	status: UserStatus;

	// TODO: mvp 버전만 creator로 생성(허가 작업 없기 때문)
	@Field((type) => UserRole, { defaultValue: UserRole.Creator })
	@Column({
		comment: '계정 타입',
		type: 'enum',
		enum: UserRole,
		default: UserRole.Creator,
	})
	@IsEnum(UserRole)
	@IsOptional()
	role: UserRole;

	@Column({ default: false })
	@Field((type) => Boolean)
	@IsBoolean()
	verified: boolean;

	@Field((type) => AuthorizationPolicyEntity)
	@ManyToOne((type) => AuthorizationPolicyEntity, (auth) => auth.users)
	auth: AuthorizationPolicyEntity;

	@Field((type) => [AgreementLogEntity])
	@OneToMany((type) => AgreementLogEntity, (agreement) => agreement.user, {
		nullable: true,
	})
	agreements: AgreementLogEntity[];

	@Field((type) => String, { nullable: true })
	@Column({ comment: '파일 url', nullable: true })
	@IsString()
	@IsOptional()
	profile?: string;

	@Field((type) => String, { nullable: true })
	@Column({ comment: '한줄 소개', nullable: true })
	@IsString()
	@IsOptional()
	description?: string;

	@Field((type) => [SNSInfoEntity])
	@OneToMany((type) => SNSInfoEntity, (sns) => sns.user, { nullable: true })
	sns: SNSInfoEntity[];

	@Field((type) => [ChannelOperatorEntity])
	@OneToMany(
		(type) => ChannelOperatorEntity,
		(channelOperator) => channelOperator.user,
		{ nullable: true },
	)
	channelOperator: ChannelOperatorEntity[];

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword(): Promise<void> {
		if (this.password) {
			try {
				this.password = await bcrypt.hash(this.password, 10);
			} catch (e) {
				console.log(e);
				throw new InternalServerErrorException();
			}
		}
	}

	async checkPassword(password: string): Promise<boolean> {
		try {
			return await bcrypt.compare(password, this.password);
		} catch (e) {
			console.log(e);
			throw new InternalServerErrorException();
		}
	}
}
