import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType("ContentFileInput")
@ObjectType("ContentFileOutput")
@Entity("ContentFile")
export class ContentFileEntity {
    /**
     * 콘텐츠 파일
     */

    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => String)
    @Column({ comment: '파일 url' })
    @IsString()
    file: string;

    @Field(type => Boolean)
    @Column()
    @IsBoolean()
    isPreview: boolean
}