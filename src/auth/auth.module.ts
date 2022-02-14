import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { UsersModule } from '../users/users.module'

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
