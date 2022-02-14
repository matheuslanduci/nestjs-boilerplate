import { UseGuards } from '@nestjs/common'

import { AuthGuard } from '@shared/guards/auth.guard'

/**
 * Apply an auth guard to the route. You can use this to protect routes.
 */
export const Auth = () => UseGuards(AuthGuard)
