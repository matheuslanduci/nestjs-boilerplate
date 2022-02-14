import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

import { MailerService } from './mailer.service'

import { MailOptions } from './interfaces/mail-options.interface'

@Processor('mail')
export class MailerProcessor {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Process the mail job.
   *
   * @param job The job with the mail options
   */
  @Process('sendMail')
  async sendMail(job: Job<MailOptions>): Promise<void> {
    return this.mailerService.sendMailFromQueue(job.data)
  }
}
