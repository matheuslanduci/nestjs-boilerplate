import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * Get the user from the request.
 *
 * @param data The property to get from the user.
 * @param context The execution context.
 */
export const User = createParamDecorator(
  (data?: string, ctx?: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user

    return data ? user?.[data] : user
  }
)
