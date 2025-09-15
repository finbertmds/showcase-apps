import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  // Override canActivate to allow requests without authentication
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Try to authenticate, but don't throw error if fails
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      // If authentication fails, still allow the request to continue
      // The resolver will handle the case when user is not authenticated
      return true;
    }
  }
}
