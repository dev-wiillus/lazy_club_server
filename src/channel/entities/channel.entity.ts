import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { IsEnum, IsNumber, IsOptional, IsString, Length } from "class-validator"
import { CoreEntity } from "src/common/entities/core.entity";
import { ChannelOperatorEntity } from "./channel_operator.entity";


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

    @Field(type => Number)
    @Column({ nullable: true })
    @IsNumber()
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

    @Field(type => String)
    @Column({ comment: '채널 이미지' })
    @IsString()
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

    @Field(type => [ChannelOperatorEntity])
    @ManyToOne(type => ChannelOperatorEntity, operator => operator.channel, { nullable: false })
    operator: ChannelOperatorEntity[]
}
