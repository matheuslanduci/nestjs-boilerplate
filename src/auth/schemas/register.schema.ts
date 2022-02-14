import Joi from 'joi'

import { RegisterDto } from '../dto/register.dto'

export const RegisterSchema = Joi.object<RegisterDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})
