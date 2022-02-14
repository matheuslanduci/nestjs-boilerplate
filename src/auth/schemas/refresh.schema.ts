import Joi from 'joi'

export const RefreshSchema = Joi.object().keys({
  refreshToken: Joi.string().required()
})
