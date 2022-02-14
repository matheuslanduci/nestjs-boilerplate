import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { User } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

import { UsersService } from '../users/users.service'

import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserCreatedEvent } from './events/user-created.event'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { UserTokens } from './interfaces/user-tokens.interface'

@Injectable()
export class AuthService {
  private secret: string

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET')
  }

  async validateLogin(data: LoginDto): Promise<User> {
    const userWithProvidedEmail = await this.usersService.findOne({
      where: { email: data.email }
    })

    if (!userWithProvidedEmail) {
      throw new NotFoundException({
        message: 'User with provided email and password does not exist'
      })
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      userWithProvidedEmail.password
    )

    if (!isPasswordValid) {
      throw new NotFoundException({
        message: 'User with provided email and password does not exist'
      })
    }

    return userWithProvidedEmail
  }

  async validateRegister(data: RegisterDto): Promise<void> {
    const userWithProvidedEmail = await this.usersService.findOne({
      where: { email: data.email }
    })

    if (userWithProvidedEmail) {
      throw new UnprocessableEntityException({
        message: 'User with provided email already exists'
      })
    }
  }

  async validateRefresh(refreshToken: string): Promise<User> {
    const user = await this.usersService.findOne({
      where: {
        ApiToken: {
          some: { token: refreshToken }
        }
      }
    })

    if (!user) {
      throw new NotFoundException({
        message: 'User with provided refresh token does not exist'
      })
    }

    return user
  }

  async register(data: RegisterDto): Promise<User> {
    const user = await this.usersService.create({
      data: {
        email: data.email,
        password: await bcrypt.hash(data.password, 10)
      }
    })

    this.eventEmitter.emit('user.created', new UserCreatedEvent(user.email))

    return user
  }

  async login(user: User): Promise<UserTokens> {
    const accessToken = this.generateAccessToken(user)
    const refreshToken = await this.generateRefreshToken(user)

    return { accessToken, refreshToken }
  }

  private generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email
    }

    const token = jwt.sign(payload, this.secret, { expiresIn: '15m' })

    return token
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const token = await this.usersService.createToken(user.id)

    return token
  }
}
