import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { ChannelTagEntity } from "./channel_tag.entity";

@InputType("ChannelCategoryInput")
@ObjectType("ChannelCategoryOutput")
@Entity('ChannelCategory')
@Unique("id", ["channel_id", "tag_id"])
export class ChannelCategoryEntity {
    /**
        채널 카테고리
     */

        @PrimaryColumn()
        channel_id: number;
    
        @PrimaryColumn()
        tag_id: number;
    
    @Field(type => ChannelEntity)
    @ManyToOne(type => ChannelEntity, channel => channel.id)
    @JoinColumn({ name: "channel_id" })
    channel: ChannelEntity

    @Field(type => ChannelTagEntity)
    @ManyToOne(type => ChannelTagEntity, tag => tag.id)
    @JoinColumn({ name: "tag_id" })
    tag: ChannelTagEntity
}