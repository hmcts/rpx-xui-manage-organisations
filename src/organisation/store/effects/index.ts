import { OrganisationEffects } from './organisation.effects';
import { PBAEffects } from './pba.effects';
import { AddressEffects } from './address.effects';
import { NameEffects } from './name.effects';
import { SraEffects } from './sra.effects';

export const effects: any[] = [
  OrganisationEffects,
  PBAEffects,
  AddressEffects,
  NameEffects,
  SraEffects
];

export * from './organisation.effects';
export * from './address.effects';
export * from './name.effects';
export * from './sra.effects';
