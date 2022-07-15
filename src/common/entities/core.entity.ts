import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class CoreEntity {
    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => Date)
    @CreateDateColumn()
    create_time: Date;

    @Field(type => Date)
    @UpdateDateColumn()
    update_time: Date;
}