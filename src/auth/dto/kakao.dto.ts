import { CoreOutput } from "@root/common/dto/output.dto";


export class KakaoInput {
    name: string;

    kakaoId: string;

    email?: string;

    nickname?: string;

    profile?: string;
}

export class KakaoOutput extends CoreOutput { }