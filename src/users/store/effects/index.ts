import { InviteUserEffects } from './invite-user.effects';
import { UsersEffects } from './users.effects';

export const effects: any[] = [
  UsersEffects,
  InviteUserEffects
];
export * from './users.effects';
export * from './invite-user.effects';
