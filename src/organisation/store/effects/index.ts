import { OrganisationEffects } from './organisation.effects';
import { PBAEffects } from './pba.effects';
import { AddressEffects } from './address.effects';

export const effects: any[] = [
  OrganisationEffects,
  PBAEffects,
  AddressEffects
];

export * from './organisation.effects';
export * from './address.effects';
