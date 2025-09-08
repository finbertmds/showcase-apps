import { BadRequestException } from '@nestjs/common';

export interface FieldError {
  field: string;
  message: string;
  code: string;
}

export class ValidationException extends BadRequestException {
  public readonly fieldErrors: FieldError[];

  constructor(fieldErrors: FieldError[]) {
    super({
      message: 'Validation failed',
      fieldErrors,
    });
    this.fieldErrors = fieldErrors;
  }

  static duplicateField(field: string, value: string): ValidationException {
    return new ValidationException([
      {
        field,
        message: `${field} '${value}' already exists`,
        code: 'DUPLICATE_FIELD',
      },
    ]);
  }

  static invalidField(field: string, message: string): ValidationException {
    return new ValidationException([
      {
        field,
        message,
        code: 'INVALID_FIELD',
      },
    ]);
  }
}
