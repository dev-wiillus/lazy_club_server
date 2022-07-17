import { Field,  InputType,  ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AgreementLogEntity } from './agreement_log.entity';
import { AuthorizationPolicyEntity } from './authorization_policy.entity';
import { SNSInfoEntity } from './sns_info.entity';
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from '@nestjs/common';
import { ChannelOperatorEntity } from 'src/channel/entities/channel_operator.entity';

enum UserStatus {
    DELETED = 'deleted',  // 탈퇴
    RUNNING = 'running',  // 사용중
    PENDING = 'pending'  // 승인 대기
}

registerEnumType(UserStatus, { name: 'UserStatusType' })

@InputType("UserInput")
@ObjectType("UserOutput")
@Entity('User')
export class UserEntity extends CoreEntity {
    /* 
        유저
    */

    @Field(type => String)
    @Column({ length: 200 })
    @IsString()
    name: string;

    @Field(type => String)
    @Column({ length: 20, nullable: true })
    @IsString()
    phone: string;

    @Field(type => String)
    @Column({ length: 200, unique: true })
    @IsEmail()
    email: string;

    @Field(type => String)
    @Column({ length: 100, select: false })
    @IsString()
    password: string;

    @Field(type => String)
    @Column({ length: 200 })
    @IsString()
    nickname: string;

    @Field(type => String, { defaultValue: UserStatus.PENDING })
    @Column({
        comment: '계정 상태',
        type: "enum",
        enum: UserStatus,
        default: UserStatus.PENDING
    })
    @IsEnum(UserStatus)
    @IsOptional()
    status: UserStatus;

    @Column({ default: false })
    @Field(type => Boolean)
    @IsBoolean()
    verified: boolean;

    @Field(type => AuthorizationPolicyEntity)
    @ManyToOne(type => AuthorizationPolicyEntity, auth => auth.users)
    auth: AuthorizationPolicyEntity

    @Field(type => [AgreementLogEntity])
    @OneToMany(type => AgreementLogEntity, agreement => agreement.user, { nullable: true })
    agreements: AgreementLogEntity[]

    @Field(type => [SNSInfoEntity])
    @OneToMany(type => SNSInfoEntity, sns => sns.user, { nullable: true })
    sns: SNSInfoEntity[]

    @Field(type => [ChannelOperatorEntity])
    @OneToMany(type => ChannelOperatorEntity, channelOperator => channelOperator.user, { nullable: true })
    channelOperator: ChannelOperatorEntity[]

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10)
            } catch (e) {
                console.log(e);
                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword(password: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, this.password)
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException();
        }
    }
}




