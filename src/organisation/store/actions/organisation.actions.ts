// load organisation
import { Action } from '@ngrx/store';
import { PendingPaymentAccount } from '../../../models/pendingPaymentAccount.model';

export const LOAD_ORGANISATION = '[Organisation] Load Organisation';
export const LOAD_ORGANISATION_SUCCESS = '[Organisation] Load Organisation Success';
export const LOAD_ORGANISATION_FAIL = '[Organisation] Load Organisation Fail';

export const UPDATE_ORGANISATION_PBA_PENDING_ADD = '[Organisation] Update Pending PBA addition to organisation';
export const UPDATE_ORGANISATION_PBA_PENDING_REMOVE = '[Organisation] Update Pending PBA removal from organisation';

export const ORGANISATION_UPDATE_PBAS = '[Organisation] Organisation Update PBAs';
export const ORGANISATION_UPDATE_PBA_RESPONSE = '[Organisation] Organisation Update PBAs Response';

export class LoadOrganisation {
  public readonly type = LOAD_ORGANISATION;
  constructor() { }
}

export class LoadOrganisationSuccess implements Action {
  public readonly type = LOAD_ORGANISATION_SUCCESS;
  constructor(public payload: any) {
  }
}

export class LoadOrganisationFail implements Action {
  public readonly type = LOAD_ORGANISATION_FAIL;
  constructor(public payload: any) { }
}

export class UpdateOrganisationPendingAddPbas implements Action {
  public readonly type = UPDATE_ORGANISATION_PBA_PENDING_ADD;
  constructor(public payload: any) { }
}

export class UpdateOrganisationPendingRemovePbas implements Action {
  public readonly type = UPDATE_ORGANISATION_PBA_PENDING_REMOVE;
  constructor(public payload: any) { }
}

export class OrganisationUpdatePBAs implements Action {
  public readonly type = ORGANISATION_UPDATE_PBAS;
  constructor(public payload: PendingPaymentAccount) { }
}

export class OrganisationUpdatePBAResponse implements Action {
  public readonly type = ORGANISATION_UPDATE_PBA_RESPONSE;
  constructor(public payload: any) { }
}

export type organisationActions =
  | LoadOrganisation
  | LoadOrganisationSuccess
  | LoadOrganisationFail
  | UpdateOrganisationPendingAddPbas
  | UpdateOrganisationPendingRemovePbas
  | OrganisationUpdatePBAs
  | OrganisationUpdatePBAResponse;

