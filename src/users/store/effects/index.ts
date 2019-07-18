import { UsersEffects } from './users.effects';
import { InviteUserEffects } from './invite-user.effects';

export const effects: any[] = [
  UsersEffects,
  InviteUserEffects
];
export * from './users.effects';
export * from './invite-user.effects';
