import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'
import { MailerService } from 'src/mailer/mailer.service'

import { UserCreatedEvent } from '../events/user-created.event'

@Injectable()
export class UserCreatedListener {
  public appName = this.configService.get<string>('APP_NAME')

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent): Promise<void> {
    await this.mailerService.sendMail({
      to: event.email,
      subject: `Welcome to ${this.appName}!`,
      view: 'welcome'
    })
  }
}
