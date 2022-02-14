import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import ms from 'ms'

import { generateRandomString } from '@shared/utils/generateRandomString'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prismaService.user.findMany(args)
  }

  async findOne(args: Prisma.UserFindFirstArgs): Promise<User> {
    return this.prismaService.user.findFirst(args)
  }

  async create(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prismaService.user.create(args)
  }

  async update(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.prismaService.user.update(args)
  }

  async delete(args: Prisma.UserDeleteArgs): Promise<User> {
    return this.prismaService.user.delete(args)
  }

  async createToken(userId: string): Promise<string> {
    const amountOfApiTokens = await this.prismaService.apiToken.count({
      where: {
        userId: userId
      }
    })

    const randomString = generateRandomString(16)

    const token = 1 + amountOfApiTokens + '|' + randomString

    await this.prismaService.apiToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + ms('5d'))
      }
    })

    return token
  }
}
