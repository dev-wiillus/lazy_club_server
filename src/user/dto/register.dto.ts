import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { UserEntity } from "src/user/entities/user.entity";

@InputType()
export class RegisterInput extends PickType(UserEntity, [
    'name',
    'email',
    'password',
    'nickname',
    'phone',
    'status',
], InputType) { }


@ObjectType()
export class RegisterOutput extends CoreOutput { }