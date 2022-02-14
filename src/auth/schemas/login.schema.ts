import Joi from 'joi'
import { LoginDto } from '../dto/login.dto'

export const LoginSchema = Joi.object<LoginDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})
