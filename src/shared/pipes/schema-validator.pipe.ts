import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ObjectSchema, ValidationErrorItem } from 'joi'

import { ValidationError } from '@shared/interfaces/validation-error.interface'

@Injectable()
export class SchemaValidatorPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: object): object {
    const { error } = this.schema.validate(value, {
      abortEarly: false
    })

    if (error) {
      const details = this.mapValidationErrors(error.details)

      throw new BadRequestException({
        error: 'A validation error occurred',
        details
      })
    }

    return value
  }

  private mapValidationErrors(
    errors: ValidationErrorItem[]
  ): ValidationError[] {
    return errors.map((error) => ({
      message: error.message,
      property: error.context.key
    }))
  }
}
