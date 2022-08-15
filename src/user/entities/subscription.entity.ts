import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsOptional, } from "class-validator";
import { ChannelEntity } from "src/channel/entities/channel.entity";
import { RangeEntity } from "src/common/entities/core.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

enum SubscriptionStatus {
    STOPPED = 'stopped',  // 정지
    RUNNING = 'running',  // 구독중
}

registerEnumType(SubscriptionStatus, { name: 'SubscriptionStatusType' })

@InputType("SubscriptionInput")
@ObjectType("SubscriptionOutput")
@Entity('Subscription')
export class SubscriptionEntity extends RangeEntity {
    /*
        구독
    */

    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => UserEntity)
    @ManyToOne(type => UserEntity, user => user.id)
    user: UserEntity

    @Field(type => ChannelEntity)
    @ManyToOne(type => ChannelEntity, channel => channel.id)
    channel: ChannelEntity

    @Field(type => SubscriptionStatus, { defaultValue: SubscriptionStatus.RUNNING })
    @Column({
        comment: '구독 상태',
        type: "enum",
        enum: SubscriptionStatus,
        default: SubscriptionStatus.RUNNING
    })
    @IsEnum(SubscriptionStatus)
    @IsOptional()
    status: SubscriptionStatus;

    @Field(type => Number)
    @Column({ nullable: true })
    @IsOptional()
    monthlyAmount: number;
}