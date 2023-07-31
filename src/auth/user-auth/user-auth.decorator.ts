import { SetMetadata } from '@nestjs/common';

export const UserAuth = (...args: string[]) => SetMetadata('user-auth', args);
