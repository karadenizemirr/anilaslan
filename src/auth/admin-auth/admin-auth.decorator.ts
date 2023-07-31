import { SetMetadata } from '@nestjs/common';

export const AdminAuth = (...args: string[]) => SetMetadata('admin-auth', args);
