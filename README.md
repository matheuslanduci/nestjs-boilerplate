<img alt="NestJS Boilerplate" src="https://i.imgur.com/jVD4LvX.png">
<h2 align="center">
  NestJS Boilerplate
</h2>
<p align="center">
  A boilerplate for creating NestJS applications.
</p>

## Features

- Relational databases with [Prisma ORM](https://www.prisma.io/)
- Queues with [Bull](https://github.com/OptimalBits/bull)
- Authentication with [JWT](https://jwt.io)
- Mail sending with [Nodemailer](https://nodemailer.com)
- Request validation with [Joi](https://github.com/sideway/joi)

## Prerequisites

- A package manager (e.g. npm, yarn, pnpm)
- [Node.js](https://nodejs.org/)
- [NestJS CLI](https://docs.nestjs.com)
- [Redis](https://redis.io/) and [PostgreSQL](https://www.postgresql.org/) or [Docker](https://www.docker.com/)

## Installation

- Clone the repository

```bash
  $ git clone https://github.com/matheuslanduci/nestjs-boilerplate.git
```

- Install dependencies

```bash
  $ cd nestjs-boilerplate
  $ npm install
```

- Copy the `.env.example` file to `.env`

- Setup the database

```bash
  $ cd nestjs-boilerplate
  $ npm run db:setup
```

- Run the application

```bash
  $ npm run start:dev
```

### Endpoints

- Get the endpoints from the folder `workspaces`. Modules available:
  - [Insomnia](https://insomnia.rest/)

### Import Patterns

There are some patterns to follow in your imports.

```typescript
/**
 * First, the libraries installed in the project.
 */
import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { ObjectSchema } from 'joi'

/**
 * Then, import the shared components.
 */
import { Validate } from '@shared/decorators/validate.decorator'
import { Auth } from '@shared/decorators/auth.decorator'

/**
 * Then, import the providers and controllers required by the module.
 */
import { AppController } from './app.controller'
import { AppService } from './app.service'

/**
 * Then, import the manually created modules.
 */
import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../users/users.module'

/**
 * Finally, import the other files.
 */
import { CreateUserDto } from './dto/create-user.dto'
import { IUser } from './interfaces/user.interface'
```
