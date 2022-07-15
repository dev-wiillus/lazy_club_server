import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@ObjectType()
@Entity('AgreementLog')
export class AgreementLogEntity {
    /*
        유저 약관 동의 로그
    */
    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(ztype => Boolean, { nullable: true })
    @Column({ nullable: true, comment: '마케팅 수신 동의' })
    marketing_agreement: boolean;

    @Field(ztype => Boolean, { nullable: true })
    @Column({ nullable: true, comment: '이용 약관 동의' })
    tos_agreement: boolean;

    @Field(type => Date)
    @CreateDateColumn()
    create_time: Date;

    @Field(type => UserEntity)
    @ManyToOne(type => UserEntity, user => user.agreements)
    user: UserEntity
}




