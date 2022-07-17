import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsOptional } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";

export enum ChannelBillingPolicyStatus {
    FREE = 'free',  // 무료 정책
    PAY = 'pay',  // 유료 정책
}

registerEnumType(ChannelBillingPolicyStatus, { name: 'ChannelBillingPolicyStatusType' })

@InputType("ChannelBillingPolicyInput")
@ObjectType("ChannelBillingPolicyOutput")
@Entity("ChannelBillingPolicy")
export class ChannelBillingPolicyEntity {

    @PrimaryColumn()
    channel_id: number;

    @Field(type => ChannelEntity)
    @OneToOne(type => ChannelEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "channel_id" })
    channel: ChannelEntity;

    @Field(type => ChannelBillingPolicyStatus, { defaultValue: ChannelBillingPolicyStatus.FREE })
    @Column({
        comment: '채널 과금 정책 상태',
        type: "enum",
        enum: ChannelBillingPolicyStatus,
        default: ChannelBillingPolicyStatus.FREE
    })
    @IsEnum(ChannelBillingPolicyStatus)
    status: ChannelBillingPolicyStatus;

    @Field(type => Number)
    @Column({ nullable: true })
    @IsOptional()
    monthlyAmount: number;
}