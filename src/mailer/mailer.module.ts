import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MailerService } from './mailer.service'
import { MailerProcessor } from './mailer.processor'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail'
    }),
    ConfigModule
  ],
  providers: [MailerService, MailerProcessor],
  exports: [MailerService]
})
export class MailerModule {}
