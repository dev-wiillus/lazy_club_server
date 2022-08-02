import { Field, Float, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { MutateTimeEntity } from "src/common/entities/core.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { ChannelEntity } from "./channel.entity";

export enum ChannelOperatorStatus {
    DELETED = 'deleted',  // 삭제
    STOPPED = 'stopped',  // 정지
    RUNNING = 'running',  // 사용중
    PENDING = 'pending'  // 승인 대기
}

registerEnumType(ChannelOperatorStatus, { name: 'ChannelOperatorStatusType' })

@InputType("ChannelOperatorInput")
@ObjectType("ChannelOperatorOutput")
@Entity('ChannelOperator')
@Unique("id", ["userId", "channelId"])
export class ChannelOperatorEntity extends MutateTimeEntity {
    /*
        채널 운영진
    */

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    channelId: number;

    @Field(type => UserEntity)
    @ManyToOne(type => UserEntity, user => user.id)
    @JoinColumn({ name: "userId" })
    user: UserEntity

    @Field(type => ChannelEntity)
    @ManyToOne(type => ChannelEntity, channel => channel.id)
    @JoinColumn({ name: "channelId" })
    channel: ChannelEntity

    @Field(type => String)
    @Column({ length: 30, comment: '정산 계좌', nullable: true })
    @IsString()
    returnAccount: string;

    @Field(type => Float)
    @Column({ comment: '정산 비율', nullable: true })
    @IsNumber()
    returnRatio: number;

    @Field(type => String)
    @Column({ length: 10, comment: '사업자 등록 번호', nullable: true })
    @IsString()
    businessRegistrationNumber: string;

    @Field(type => String, { defaultValue: ChannelOperatorStatus.PENDING })
    @Column({
        comment: '상태',
        type: "enum",
        enum: ChannelOperatorStatus,
        default: ChannelOperatorStatus.PENDING
    })
    @IsEnum(ChannelOperatorStatus)
    @IsOptional()
    status: ChannelOperatorStatus;

}