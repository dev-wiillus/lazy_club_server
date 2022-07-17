import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@InputType("AuthorizationPolicyInput")
@ObjectType("AuthorizationPolicyOutput")
@Entity('AuthorizationPolicy')
export class AuthorizationPolicyEntity {
    /*
        유저 권한 정책
    */
    @Field(type => Number)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(type => String)
    @Column({ length: 200 })
    @IsString()
    name: string;

    @Field(type => String, { nullable: true })
    @Column({ length: 500, nullable: true })
    @IsString()
    description: string;

    @Field(type => [UserEntity], { nullable: true })
    @OneToMany(type => UserEntity, user => user.auth, { nullable: true })
    users: UserEntity[]
}
