import { Field,  InputType,  ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne,  PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@InputType("SNSInfoInput")
@ObjectType("SNSInfoOutput")
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
    @IsString()
    snsId: String;

    @Field(type => String)
    @Column({ length: 45, comment: 'SNS 종류' })
    @IsString()
    snsType: String;

    @Field(type => String)
    @Column({ length: 45, comment: 'SNS 이름' })
    @IsString()
    snsName: String;

    @Field(type => String)
    @Column({ length: 45, comment: 'SNS 프로필' })
    @IsString()
    snsProfile: String;

    @Field(type => Date)
    @CreateDateColumn({ comment: 'SNS 연동 날짜' })
    @IsDate()
    snsConnectedDate: Date;

    @Field(type => UserEntity)
    @ManyToOne(type => UserEntity, user => user.sns)
    user: UserEntity
}




