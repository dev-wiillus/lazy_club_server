import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { IsEnum, IsNumber, IsOptional, IsString, Length } from "class-validator"
import { CoreEntity } from "src/common/entities/core.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { ChannelEntity } from "src/channel/entities/channel.entity";


export enum ContentCategory {
    BLOG = 'blog',  // 블로그
    LIVE = 'live',  // 라이브 스트리밍
}

registerEnumType(ContentCategory, { name: 'ContentCategoryType' })

export enum ContentStatus {
    DELETED = 'deleted',  // 삭제
    NORMAL = 'normal',  // 정상
}

registerEnumType(ContentStatus, { name: 'ContentStatusType' })

@InputType("ContentInput")
@ObjectType("ContentOutput")
@Entity('Content')
export class ContentEntity extends CoreEntity {
    /* 
        콘텐츠
    */

    @Field(type => String)
    @Column({ length: 100, })
    @IsString()
    @Length(1, 100)
    title: string;

    @Field(type => ContentCategory, { defaultValue: ContentCategory.BLOG })
    @Column({
        comment: '콘텐츠 종류',
        type: "enum",
        enum: ContentCategory,
        default: ContentCategory.BLOG
    })
    @IsEnum(ContentCategory)
    @IsOptional()
    category: ContentCategory;

    @Field(type => String)
    @Column({ comment: '콘텐츠 내용', type: "blob" })
    content: string;

    @Field(type => Number)
    @Column({ comment: "조회 수" })
    @IsNumber()
    hit: number;

    @Field(type => ContentStatus, { defaultValue: ContentStatus.NORMAL })
    @Column({
        comment: '콘텐츠 상태',
        type: "enum",
        enum: ContentStatus,
        default: ContentStatus.NORMAL
    })
    @IsEnum(ContentStatus)
    @IsOptional()
    status: ContentStatus;

    @Field(type => UserEntity)
    @ManyToOne(type => UserEntity, user => user.id)
    user: UserEntity

    @Field(type => ChannelEntity)
    @ManyToOne(type => ChannelEntity, channel => channel.id)
    channel: ChannelEntity

}
