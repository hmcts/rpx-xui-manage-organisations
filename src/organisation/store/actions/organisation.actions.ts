// load organisation
import { Action } from '@ngrx/store';

export const LOAD_ORGANISATION = '[Organisation] Load Organisation';
export const LOAD_ORGANISATION_SUCCESS = '[Organisation] Load Organisation Success';
export const LOAD_ORGANISATION_FAIL = '[Organisation] Load Organisation Fail';

export const UPDATE_ORGANISATION_PBA_PENDING_ADD = '[Organisation] Update Pending PBA addition to organisation';
export const UPDATE_ORGANISATION_PBA_PENDING_REMOVE = '[Organisation] Update Pending PBA removal from organisation';

export class LoadOrganisation {
  readonly type = LOAD_ORGANISATION;
  constructor() { }
}

export class LoadOrganisationSuccess implements Action {
  readonly type = LOAD_ORGANISATION_SUCCESS;
  constructor(public payload: any) {
  }
}

export class LoadOrganisationFail implements Action {
  readonly type = LOAD_ORGANISATION_FAIL;
  constructor(public payload: any) { }
}

export class UpdateOrganisationPendingAddPbas implements Action {
  readonly type = UPDATE_ORGANISATION_PBA_PENDING_ADD;
  constructor(public payload: any) { }
}

export class UpdateOrganisationPendingRemovePbas implements Action {
  readonly type = UPDATE_ORGANISATION_PBA_PENDING_REMOVE;
  constructor(public payload: any) { }
}

export type organisationActions =
  | LoadOrganisation
  | LoadOrganisationSuccess
  | LoadOrganisationFail
  | UpdateOrganisationPendingAddPbas
  | UpdateOrganisationPendingRemovePbas;

