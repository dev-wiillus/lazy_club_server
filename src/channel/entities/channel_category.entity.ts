import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { ChannelTagEntity } from "./channel_tag.entity";

@InputType("ChannelCategoryInput")
@ObjectType("ChannelCategoryOutput")
@Entity('ChannelCategory')
@Unique("id", ["channelId", "tagId"])
export class ChannelCategoryEntity {
    /**
        채널 카테고리
     */

        @PrimaryColumn()
        channelId: number;
    
        @PrimaryColumn()
        tagId: number;
    
    @Field(type => ChannelEntity)
    @ManyToOne(type => ChannelEntity, channel => channel.id)
    @JoinColumn({ name: "channelId" })
    channel: ChannelEntity

    @Field(type => ChannelTagEntity)
    @ManyToOne(type => ChannelTagEntity, tag => tag.id)
    @JoinColumn({ name: "tagId" })
    tag: ChannelTagEntity
}