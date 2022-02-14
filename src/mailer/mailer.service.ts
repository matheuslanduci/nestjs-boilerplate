import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JobOptions, Queue } from 'bull'
import { createTransport, Transporter } from 'nodemailer'
import { readFile } from 'fs/promises'
import * as hbs from 'handlebars'

import { MailOptions } from './interfaces/mail-options.interface'

@Injectable()
export class MailerService {
  private transporter: Transporter

  constructor(
    @InjectQueue('mail') private readonly mailQueue: Queue<MailOptions>,
    private readonly configService: ConfigService
  ) {
    const mailHost = this.configService.get<string>('MAIL_HOST')
    const mailPort = this.configService.get<number>('MAIL_PORT')
    const mailUser = this.configService.get<string>('MAIL_USER')
    const mailPass = this.configService.get<string>('MAIL_PASS')
    const mailFromAddress = this.configService.get<string>('MAIL_FROM_ADDRESS')
    const mailFromName = this.configService.get<string>('MAIL_FROM_NAME')

    this.transporter = createTransport({
      from: {
        address: mailFromAddress,
        name: mailFromName
      },
      host: mailHost,
      port: mailPort,
      auth: {
        user: mailUser,
        pass: mailPass
      }
    })
  }

  /**
   * Add a mail to the job queue.
   *
   * @param options The mail options
   * @param jobOptions The job options if you want to configure the job
   *
   * @example
   * await this.mailerService.sendMail({
   *   to: 'to@mail.com',
   *   subject: 'subject',
   *   view: 'view',
   *   context: {
   *     name: 'name'
   *   }
   * })
   */
  async sendMail(
    mailOptions: MailOptions,
    jobOptions?: JobOptions
  ): Promise<void> {
    await this.mailQueue.add('sendMail', mailOptions, jobOptions)
  }

  /**
   * Send the mail.
   *
   * This method is used by the job processor.
   * You should not use it directly.
   *
   * @param options The mail options
   */
  async sendMailFromQueue(options: MailOptions): Promise<void> {
    const { to, context, subject, view } = options

    const html = await this.generateHtml(
      `src/mailer/views/${view}.hbs`,
      context
    )

    return this.transporter.sendMail({
      to,
      subject,
      html
    })
  }

  /**
   * Generate the mail body.
   *
   * @param view The view name
   * @param context The context
   * @returns The template rendered
   */
  private async generateHtml(view: string, context: any): Promise<string> {
    let file: Buffer

    try {
      file = await readFile(view)
    } catch (error) {
      throw new Error(`The view ${view} does not exist`)
    }

    const template = hbs.compile(file.toString('utf-8'))

    return template(context)
  }
}
