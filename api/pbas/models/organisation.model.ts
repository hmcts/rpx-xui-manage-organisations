import { PBANumberModel } from './pbaNumber.model';

export interface OrganisationModel {
  organisationIdentifier: string;
  status: string;
  pbaNumbers?: PBANumberModel[];
}
