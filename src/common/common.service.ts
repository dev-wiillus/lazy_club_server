import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ReadFileInput, ReadFileOutput } from './dto/read-file.dto';

@Injectable()
export class CommonService {
	constructor() { }

	async loadHtmlFile({ path }: ReadFileInput): Promise<ReadFileOutput> {
		try {
			const file = await fs.readFileSync(`static/${path}`, {
				encoding: 'utf-8',
			});
			return {
				ok: true,
				result: file,
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}

	async loadImageFile({ path }: ReadFileInput): Promise<ReadFileOutput> {
		try {
			const file = await fs.readFileSync(`static/${path}`, {
				encoding: 'base64',
			});
			return {
				ok: true,
				result: file,
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}

	generate_temp_password() {
		const ranValue1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
		const ranValue2 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		const ranValue3 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		const ranValue4 = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

		let temp_pw = "";

		for (let i = 0; i < 2; i++) {
			const ranPick1 = Math.floor(Math.random() * ranValue1.length);
			const ranPick2 = Math.floor(Math.random() * ranValue2.length);
			const ranPick3 = Math.floor(Math.random() * ranValue3.length);
			const ranPick4 = Math.floor(Math.random() * ranValue4.length);
			temp_pw = temp_pw + ranValue1[ranPick1] + ranValue2[ranPick2] + ranValue3[ranPick3] + ranValue4[ranPick4];
		}
		return temp_pw
	}
}
