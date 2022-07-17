import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsDate } from "class-validator";
import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@InputType({ isAbstract: true })
@ObjectType()
export class CreatedAtEntity {
    @Field(type => Date)
    @CreateDateColumn()
    @IsDate()
    createdAt: Date;
}

@InputType({ isAbstract: true })
@ObjectType()
export class MutateTimeEntity extends CreatedAtEntity {
    @Field(type => Date)
    @UpdateDateColumn()
    @IsDate()
    updatedAt: Date;
}

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class CoreEntity extends MutateTimeEntity {
    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;
}

@InputType({ isAbstract: true })
@ObjectType()
export class RangeEntity {

    @Field(type => Date)
    @CreateDateColumn()
    @IsDate()
    startedAt: Date;

    @Field(type => Date)
    @DeleteDateColumn()
    @IsDate()
    endedAt: Date;
}

