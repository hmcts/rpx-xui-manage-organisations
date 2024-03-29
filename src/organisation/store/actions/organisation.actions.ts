// load organisation
import { Action } from '@ngrx/store';
import { OrganisationDetails } from '../../../models/organisation.model';
import { PBANumberModel } from '../../../models/pbaNumber.model';
import { PendingPaymentAccount } from '../../../models/pendingPaymentAccount.model';

export const LOAD_ORGANISATION = '[Organisation] Load Organisation';
export const LOAD_ORGANISATION_SUCCESS = '[Organisation] Load Organisation Success';
export const LOAD_ORGANISATION_FAIL = '[Organisation] Load Organisation Fail';

export const UPDATE_ORGANISATION_PBA_PENDING_ADD = '[Organisation] Update Pending PBA addition to organisation';
export const UPDATE_ORGANISATION_PBA_PENDING_REMOVE = '[Organisation] Update Pending PBA removal from organisation';

export const ORGANISATION_UPDATE_PBAS = '[Organisation] Organisation Update PBAs';
export const ORGANISATION_UPDATE_PBA_RESPONSE = '[Organisation] Organisation Update PBAs Response';
export const ORGANISATION_UPDATE_PBA_ERROR = '[Organisation] Organisation Update PBAs Error';
export const ORGANISATION_UPDATE_PBA_ERROR_RESET = '[Organisation] Organisation Update PBAs Error Reset';

export const ORGANISATION_UPDATE_PROFILE_IDS = '[Organisation] Organisation Update Profile Ids';

export class LoadOrganisation {
  public readonly type = LOAD_ORGANISATION;
}

export class LoadOrganisationSuccess implements Action {
  public readonly type = LOAD_ORGANISATION_SUCCESS;
  constructor(public payload: OrganisationDetails) {}
}

export class LoadOrganisationFail implements Action {
  public readonly type = LOAD_ORGANISATION_FAIL;
  constructor(public payload: any) {}
}

export class UpdateOrganisationPendingAddPBAs implements Action {
  public readonly type = UPDATE_ORGANISATION_PBA_PENDING_ADD;
  constructor(public payload: PBANumberModel[]) {}
}

export class UpdateOrganisationPendingRemovePBAs implements Action {
  public readonly type = UPDATE_ORGANISATION_PBA_PENDING_REMOVE;
  constructor(public payload: PBANumberModel[]) {}
}

export class OrganisationUpdatePBAs implements Action {
  public readonly type = ORGANISATION_UPDATE_PBAS;
  constructor(public payload: PendingPaymentAccount) {}
}

export class OrganisationUpdatePBAResponse implements Action {
  public readonly type = ORGANISATION_UPDATE_PBA_RESPONSE;
  constructor(public payload: any) {}
}

export class OrganisationUpdatePBAError implements Action {
  public readonly type = ORGANISATION_UPDATE_PBA_ERROR;
  constructor(public payload: any) {}
}

export class OrganisationUpdatePBAErrorReset implements Action {
  public readonly type = ORGANISATION_UPDATE_PBA_ERROR_RESET;
  constructor(public payload: any) {}
}

export class OrganisationUpdateUpdateProfileIds implements Action {
  public readonly type = ORGANISATION_UPDATE_PROFILE_IDS;
  constructor(public payload: string[]) {}
}

export type organisationActions =
  | LoadOrganisation
  | LoadOrganisationSuccess
  | LoadOrganisationFail
  | UpdateOrganisationPendingAddPBAs
  | UpdateOrganisationPendingRemovePBAs
  | OrganisationUpdatePBAs
  | OrganisationUpdatePBAResponse
  | OrganisationUpdatePBAError
  | OrganisationUpdatePBAErrorReset
  | OrganisationUpdateUpdateProfileIds;
