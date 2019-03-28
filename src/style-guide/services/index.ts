import { UsersService } from './users.service';
import { InviteUserService } from './invite-user.service';

export const services: any[] = [UsersService, InviteUserService];

export * from './users.service';
export * from './invite-user.service';
