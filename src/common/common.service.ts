import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ReadFileInput, ReadFileOutput } from './dto/read-file.dto';

@Injectable()
export class CommonService {
	constructor() {}

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
}
