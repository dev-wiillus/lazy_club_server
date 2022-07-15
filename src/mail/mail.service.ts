import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import * as mailgun from 'mailgun-js'


@Injectable()
export class MailService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) { }

    private async sendEmail(
        subject: string,
        to: string,
        template: string,
        emailVars: EmailVar[],

    ) {
        const mg = mailgun({ apiKey: this.options.apiKey, domain: this.options.domain })
        const data = {
            from: this.options.fromEmail,
            to,
            subject,
            template,
            'h:X-Mailgun-Variables': { test: "test" },
            ...emailVars.map(({ key, value }) => ({ [`v:${key}`]: value }))
        }
        try {
            console.log(data)
            await mg.messages().send(data, function (error, body) {
                console.log(body)
            })
        } catch (error) {
            console.log(error)
        }
    }

    sendVerificationEmail(email: string, code: string) {
        this.sendEmail(
            '계정 확인',
            'robin@wiillus.com',
            'confirm_account',
            [{
                key: 'code', value: code
            },
            {
                key: 'username', value: email
            }])
    }
}
