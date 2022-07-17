import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsDate } from 'class-validator';
import {  CreatedAtEntity } from 'src/common/entities/core.entity';
import { Column,  Entity, ManyToOne,  PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@InputType("AgreementLogInput")
@ObjectType("AgreementLogOutput")
@Entity('AgreementLog')
export class AgreementLogEntity extends CreatedAtEntity {
    /*
        유저 약관 동의 로그
    */
    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => Boolean, { nullable: true })
    @Column({ nullable: true, comment: '마케팅 수신 동의' })
    @IsBoolean()
    marketingAgreement: boolean;

    @Field(type => Boolean, { nullable: true })
    @Column({ nullable: true, comment: '이용 약관 동의' })
    @IsBoolean()
    tosAgreement: boolean;

    @Field(type => UserEntity)
    @ManyToOne(type => UserEntity, user => user.agreements)
    user: UserEntity
}




