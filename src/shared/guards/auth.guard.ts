import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'

import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface'
import { UsersService } from '../../users/users.service'

@Injectable()
export class AuthGuard implements CanActivate {
  private secret: string

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    this.secret = this.configService.get<string>('JWT_SECRET')
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization

    if (!authorization) {
      throw new UnauthorizedException({
        message: 'Authorization header is missing'
      })
    }

    const [schema, token] = authorization.split(' ')

    if (schema !== 'Bearer') {
      throw new UnauthorizedException({
        message: 'Authorization header is malformed'
      })
    }

    if (!token) {
      throw new UnauthorizedException({
        message: 'Authorization header is missing'
      })
    }

    const decoded: JwtPayload = jwt.verify(token, this.secret) as JwtPayload

    const user = await this.usersService.findOne({
      where: { id: decoded.sub },
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    })

    if (!user) {
      throw new UnauthorizedException({
        message: 'User does not exist'
      })
    }

    request.user = user

    return true
  }
}
