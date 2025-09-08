import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ValidationException } from '../exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements GqlExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    
    // Create a GraphQL error with fieldErrors in extensions
    const error = new Error(exception.message);
    (error as any).extensions = {
      code: 'VALIDATION_FAILED',
      fieldErrors: exception.fieldErrors,
    };
    
    return error;
  }
}
