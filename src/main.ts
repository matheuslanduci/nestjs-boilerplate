import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { PrismaExceptionFilter } from '@shared/filters/prisma-exception.filter'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new PrismaExceptionFilter())
  app.enableCors()

  const configService = app.get(ConfigService)

  const name = configService.get<string>('APP_NAME')
  const mode = configService.get<string>('APP_MODE')
  const port = configService.get<string>('APP_PORT')

  const logger = new Logger(name)

  await app.listen(port, () => {
    logger.log(`Application running on ${mode} mode`)
  })
}

bootstrap()
