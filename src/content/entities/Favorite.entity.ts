import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { UserEntity } from "src/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { ContentEntity } from "./content.entity";

@InputType("FavoriteInput")
@ObjectType("FavoriteOutput")
@Entity('Favorite')
@Unique("id", ["userId", "contentId"])
export class FavoriteEntity {
    /**
        콘텐츠 즐겨찾기
     */

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    contentId: number;

    @Field(type => UserEntity)
    @ManyToOne(type => UserEntity, user => user.id)
    @JoinColumn({ name: "userId" })
    user: UserEntity

    @Field(type => ContentEntity)
    @ManyToOne(type => ContentEntity, content => content.id)
    @JoinColumn({ name: "contentId" })
    content: ContentEntity
}