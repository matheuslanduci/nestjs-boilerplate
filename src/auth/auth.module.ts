import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserCreatedListener } from './listeners/user-created.listener'

import { UsersModule } from '../users/users.module'
import { MailerModule } from '../mailer/mailer.module'

@Module({
  imports: [ConfigModule, UsersModule, MailerModule],
  providers: [AuthService, UserCreatedListener],
  controllers: [AuthController]
})
export class AuthModule {}
