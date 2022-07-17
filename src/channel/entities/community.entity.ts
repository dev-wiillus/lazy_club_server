import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ChannelEntity } from "./channel.entity";

export enum CommunityStatus {
    CLOSED = 'closed',  // 무료 정책
    OPEN = 'open',  // 유료 정책
}

registerEnumType(CommunityStatus, { name: 'CommunityStatusType' })

@InputType("CommunityInput")
@ObjectType("CommunityOutput")
@Entity('Community')
export class CommunityEntity extends CoreEntity {
    /**
     * 게시판
     */

    @Field(type => UserEntity)
    @ManyToOne(type => UserEntity, user => user.id)
    user: UserEntity

    @Field(type => ChannelEntity)
    @ManyToOne(type => ChannelEntity, channel => channel.id)
    channel: ChannelEntity

    @Field(type => String)
    @Column({ length: 100, })
    @IsString()
    title: string;

    @Field(type => String)
    @Column({ type: "text", nullable: true })
    @IsString()
    content: string;

    @Field(type => CommunityStatus, { defaultValue: CommunityStatus.OPEN })
    @Column({
        comment: '게시판 상태',
        type: "enum",
        enum: CommunityStatus,
        default: CommunityStatus.OPEN
    })
    @IsEnum(CommunityStatus)
    status: CommunityStatus;

}