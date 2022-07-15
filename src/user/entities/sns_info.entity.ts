import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@ObjectType()
@Entity('SNSInfo')
export class SNSInfoEntity {
    /*
        유저 SNS 연동 정보
    */
    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => String)
    @Column({ length: 45, comment: 'SNS ID' })
    sns_id: String;

    @Field(type => String)
    @Column({ length: 45, comment: 'SNS 종류' })
    sns_type: String;

    @Field(type => String)
    @Column({ length: 45, comment: 'SNS 이름' })
    sns_name: String;

    @Field(type => String)
    @Column({ length: 45, comment: 'SNS 프로필' })
    sns_profile: String;

    @Field(type => Date)
    @CreateDateColumn({ comment: 'SNS 연동 날짜' })
    sns_connected_date: Date;

    @Field(type => UserEntity)
    @ManyToOne(type => UserEntity, user => user.sns)
    user: UserEntity
}




