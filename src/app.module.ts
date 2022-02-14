import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { PrismaModule } from './prisma/prisma.module'
import { MailerModule } from './mailer/mailer.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASS
      }
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    MailerModule,
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
