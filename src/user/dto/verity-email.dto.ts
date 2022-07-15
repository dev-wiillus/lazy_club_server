import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { VerificationEntity } from "../entities/verification.entity";

@ObjectType()
export class VerifyEmailOutput extends CoreOutput { }

@InputType()
export class VerifyEmailInput extends PickType(VerificationEntity, ['code'], InputType) {}