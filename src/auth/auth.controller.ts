import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { User as IUser } from '@prisma/client'

import { Validate } from '@shared/decorators/validate.decorator'
import { Auth } from '@shared/decorators/auth.decorator'
import { User } from '@shared/decorators/user.decorator'

import { AuthService } from './auth.service'

import { LoginResponse } from './interfaces/login-response.interface'
import { LoginSchema } from './schemas/login.schema'
import { LoginDto } from './dto/login.dto'
import { RegisterResponse } from './interfaces/register-response.interface'
import { RegisterDto } from './dto/register.dto'
import { RegisterSchema } from './schemas/register.schema'
import { RefreshResponse } from './interfaces/refresh-response.interface'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @Validate(LoginSchema)
  async login(@Body() data: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.validateLogin(data)

    const { accessToken, refreshToken } = await this.authService.login(user)

    return { accessToken, refreshToken }
  }

  @Post('register')
  @HttpCode(201)
  @Validate(RegisterSchema)
  async register(@Body() data: RegisterDto): Promise<RegisterResponse> {
    await this.authService.validateRegister(data)

    const user = await this.authService.register(data)

    const { accessToken, refreshToken } = await this.authService.login(user)

    return { accessToken, refreshToken }
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Body('refreshToken') refreshToken: string
  ): Promise<RefreshResponse> {
    const user = await this.authService.validateRefresh(refreshToken)

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.login(user)

    return { accessToken, refreshToken: newRefreshToken }
  }

  @Get('me')
  @Auth()
  async me(@User() user: IUser): Promise<IUser> {
    return user
  }
}
