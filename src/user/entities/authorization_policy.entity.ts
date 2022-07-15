import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@ObjectType()
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
    name: string;

    @Field(type => String, { nullable: true })
    @Column({ length: 500, nullable: true })
    description: string;

    @Field(type => [UserEntity], { nullable: true })
    @OneToMany(type => UserEntity, user => user.auth, { nullable: true })
    users: UserEntity[]
}
