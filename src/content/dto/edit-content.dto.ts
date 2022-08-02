import { Field, InputType, ObjectType, PartialType, } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { CreateContentInput } from "./create-content.dto";

@InputType()
export class EditContentInput extends PartialType(CreateContentInput) {
    @Field(type => Number)
    contentId: number;
}

@ObjectType()
export class EditContentOutput extends CoreOutput { }