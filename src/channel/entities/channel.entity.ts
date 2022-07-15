import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsBoolean, IsEnum, IsOptional, IsString, Length } from "class-validator"


export enum ChannelStatus {
    STOPPING = 'stopping',  // 운영 x
    RUNNING = 'running',  // 운영 o
    PENDING = 'pending'  // 운영 불가
}

registerEnumType(ChannelStatus, { name: 'ChannelStatusType' })

@ObjectType()
@Entity('Channel')
export class ChannelEntity {
    /* 
        채널
    */
    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;

    // @Field(type => UserEntity)
    // @ManyToOne(type => UserEntity, user => user.channel)
    // user: UserEntity
 
    @Field(type => Number)
    @Column({ nullable: true })
    main_content_id: number;

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

    // @Field(type => String)
    // @Column({ comment: '채널 이미지' })
    // thumbnail: String;

    @Field(type => Date)
    @CreateDateColumn()
    createTime: Date;

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
}
