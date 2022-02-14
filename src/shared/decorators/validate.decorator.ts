import { UsePipes } from '@nestjs/common'
import { ObjectSchema } from 'joi'

import { SchemaValidatorPipe } from '@shared/pipes/schema-validator.pipe'

/**
 * Validate the request against the given schema.
 *
 * @param schema The schema to validate against.
 * @returns The pipe to validate
 */
export const Validate = (schema: ObjectSchema) =>
  UsePipes(new SchemaValidatorPipe(schema))
