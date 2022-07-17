import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@InputType("ChannelTagInput")
@ObjectType("ChannelTagOutput")
@Entity('ChannelTag')
export class ChannelTagEntity {
    /**
     * 채널 태그
     */

     @Field(type => Number)
     @PrimaryGeneratedColumn()
     id: number;

     @Field(type => String)
     @Column({ comment: '태그 명', length: 200 })
     @IsString()
     name: string;
}