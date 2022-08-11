import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Length } from "class-validator"
import { CoreEntity } from "src/common/entities/core.entity";
import { ChannelOperatorEntity } from "./channel_operator.entity";
import { ContentEntity } from "src/content/entities/content.entity";
import { ChannelCategoryEntity } from "./channel_category.entity";


export enum ChannelStatus {
    STOPPING = 'stopping',  // 운영 x
    RUNNING = 'running',  // 운영 o
    PENDING = 'pending'  // 운영 불가
}

registerEnumType(ChannelStatus, { name: 'ChannelStatusType' })

@InputType("ChannelInput")
@ObjectType("ChannelOutput")
@Entity('Channel')
export class ChannelEntity extends CoreEntity {
    /* 
        채널
    */

    @Field(type => Number, { nullable: true })
    @Column({ nullable: true })
    @IsNumber()
    @IsOptional()
    mainContentId: number;

    @Field(type => String)
    @Column({ length: 100, comment: '채널 명', unique: true })
    @IsString()
    @Length(1, 100)
    title: string;

    @Field(type => String)
    @Column({ length: 200, comment: '채널 주제' })
    @IsString()
    @Length(1, 200)
    subject: string;

    @Field(type => String)
    @Column({ comment: '채널 설명', type: "text" })
    @IsString()
    description: string;

    @Field(type => String, { nullable: true })
    @Column({ comment: '채널 이미지', nullable: true })
    @IsString()
    @IsOptional()
    thumbnail: String;

    @Field(type => ChannelStatus, { defaultValue: ChannelStatus.STOPPING })
    @Column({
        comment: '채널 상태',
        type: "enum",
        enum: ChannelStatus,
        default: ChannelStatus.STOPPING
    })
    @IsEnum(ChannelStatus)
    @IsOptional()
    status: ChannelStatus;

    @Field(type => [ChannelOperatorEntity], { nullable: true })
    @OneToMany(
        type => ChannelOperatorEntity,
        operators => operators.channel,
        {
            nullable: true,
            cascade: ['remove']
        }
    )
    operators: ChannelOperatorEntity[]

    @Field(type => [ContentEntity], { nullable: true })
    @OneToMany(
        type => ContentEntity,
        contents => contents.channel,
        { nullable: true }
    )
    contents: ContentEntity[]

    @Field(type => ChannelCategoryEntity, { nullable: true })
    @OneToMany(
        type => ChannelCategoryEntity,
        category => category.channel,
        { nullable: true }
    )
    category: ChannelCategoryEntity;

    // TODO: 임시
    @Field(type => String)
    @Column({ length: 200, comment: '대표 운영자 닉네임(이름)' })
    @IsString()
    @Length(1, 200)
    agentNickname: string;

    // TODO: 임시
    @Field(type => String, { nullable: true })
    @Column({ comment: '대표 운영자 프로필', nullable: true })
    @IsString()
    @IsOptional()
    agentProfile: String;

    // TODO: 임시
    @Field(type => String)
    @Column({ comment: '대표 운영자 소개', type: "text" })
    @IsString()
    agentIntroduction: string;

    // TODO: 임시
    @Field(type => Boolean, { nullable: true })
    @Column({ nullable: true, comment: '이용 약관 동의' })
    @IsBoolean()
    termsOfService: boolean;

    // TODO: 임시
    @Field(type => Boolean, { nullable: true })
    @Column({ nullable: true, comment: '개인정보처리방침 동의' })
    @IsBoolean()
    agreements: boolean;

}
