// load organisation
import { Action } from '@ngrx/store';
import { Jurisdiction, OrganisationContactInformation, OrganisationDetails } from '../../../models/organisation.model';
import { PBANumberModel } from '../../../models/pbaNumber.model';
import { PendingPaymentAccount } from '../../../models/pendingPaymentAccount.model';
import { AddressUpdateDraft } from '../../models/address-update.model';
import { OrganisationNameUpdateDraft } from '../../models/name-update.model';
import { OrganisationSraUpdateDraft } from '../../models/sra-update.model';

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
export const LOAD_ORGANISATION_ACCESS_TYPES = '[Organisation] Load Organisation Access Types';
export const LOAD_ORGANISATION_ACCESS_TYPES_SUCCESS = '[Organisation] Load Organisation Access Types Success';
export const LOAD_ORGANISATION_ACCESS_TYPES_FAIL = '[Organisation] Load Organisation Access Types Fail';
export const LOAD_ORGANISATION_ACCESS_TYPES_FAIL_WITH_400 = '[Organisation] Load Organisation Access Types Fail with 400';
export const LOAD_ORGANISATION_ACCESS_TYPES_FAIL_WITH_401 = '[Organisation] Load Organisation Access Types Fail with 401';
export const LOAD_ORGANISATION_ACCESS_TYPES_FAIL_WITH_5xx = '[Organisation] Load Organisation Access Types Fail with 5xx';

export const INITIALISE_ORGANISATION_ADDRESS_UPDATE = '[Organisation] Initialise Address Update';
export const UPDATE_ORGANISATION_ADDRESS_DRAFT = '[Organisation] Update Address Draft';
export const CLEAR_ORGANISATION_ADDRESS_UPDATE = '[Organisation] Clear Address Update';
export const ORGANISATION_UPDATE_ADDRESS = '[Organisation] Update Address';
export const ORGANISATION_UPDATE_ADDRESS_SUCCESS = '[Organisation] Update Address Success';
export const ORGANISATION_UPDATE_ADDRESS_ERROR = '[Organisation] Update Address Error';

export const INITIALISE_ORGANISATION_NAME_UPDATE = '[Organisation] Initialise Name Update';
export const UPDATE_ORGANISATION_NAME_DRAFT = '[Organisation] Update Name Draft';
export const CLEAR_ORGANISATION_NAME_UPDATE = '[Organisation] Clear Name Update';
export const ORGANISATION_UPDATE_NAME = '[Organisation] Update Name';
export const ORGANISATION_UPDATE_NAME_SUCCESS = '[Organisation] Update Name Success';
export const ORGANISATION_UPDATE_NAME_ERROR = '[Organisation] Update Name Error';

export const INITIALISE_ORGANISATION_SRA_UPDATE = '[Organisation] Initialise SRA Update';
export const UPDATE_ORGANISATION_SRA_DRAFT = '[Organisation] Update SRA Draft';
export const CLEAR_ORGANISATION_SRA_UPDATE = '[Organisation] Clear SRA Update';
export const ORGANISATION_UPDATE_SRA = '[Organisation] Update SRA';
export const ORGANISATION_UPDATE_SRA_SUCCESS = '[Organisation] Update SRA Success';
export const ORGANISATION_UPDATE_SRA_ERROR = '[Organisation] Update SRA Error';

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

export class LoadOrganisationAccessTypes {
  public readonly type = LOAD_ORGANISATION_ACCESS_TYPES;
  constructor(public payload?: string[]) {}
}

export class LoadOrganisationAccessTypesSuccess implements Action {
  public readonly type = LOAD_ORGANISATION_ACCESS_TYPES_SUCCESS;
  constructor(public payload: Jurisdiction[]) {}
}

export class LoadOrganisationAccessTypesFail implements Action {
  public readonly type = LOAD_ORGANISATION_ACCESS_TYPES_FAIL;
  constructor(public payload: any) {}
}

export class LoadOrganisationAccessTypesFailWith400 implements Action {
  public readonly type = LOAD_ORGANISATION_ACCESS_TYPES_FAIL_WITH_400;
  constructor(public payload: any) {}
}

export class LoadOrganisationAccessTypesFailWith401 implements Action {
  public readonly type = LOAD_ORGANISATION_ACCESS_TYPES_FAIL_WITH_401;
  constructor(public payload: any) {}
}

export class LoadOrganisationAccessTypesFailWith5xx implements Action {
  public readonly type = LOAD_ORGANISATION_ACCESS_TYPES_FAIL_WITH_5xx;
  constructor(public payload: any) {}
}

export class InitialiseOrganisationAddressUpdate implements Action {
  public readonly type = INITIALISE_ORGANISATION_ADDRESS_UPDATE;
  constructor(public payload: AddressUpdateDraft) {}
}

export class UpdateOrganisationAddressDraft implements Action {
  public readonly type = UPDATE_ORGANISATION_ADDRESS_DRAFT;
  constructor(public payload: Partial<AddressUpdateDraft>) {}
}

export class ClearOrganisationAddressUpdate implements Action {
  public readonly type = CLEAR_ORGANISATION_ADDRESS_UPDATE;
}

export class OrganisationUpdateAddress implements Action {
  public readonly type = ORGANISATION_UPDATE_ADDRESS;
  constructor(public payload: OrganisationContactInformation) {}
}

export class OrganisationUpdateAddressSuccess implements Action {
  public readonly type = ORGANISATION_UPDATE_ADDRESS_SUCCESS;
  constructor(public payload: OrganisationContactInformation) {}
}

export class OrganisationUpdateAddressError implements Action {
  public readonly type = ORGANISATION_UPDATE_ADDRESS_ERROR;
  constructor(public payload: any) {}
}

export class InitialiseOrganisationNameUpdate implements Action {
  public readonly type = INITIALISE_ORGANISATION_NAME_UPDATE;
  constructor(public payload: OrganisationNameUpdateDraft) {}
}

export class UpdateOrganisationNameDraft implements Action {
  public readonly type = UPDATE_ORGANISATION_NAME_DRAFT;
  constructor(public payload: OrganisationNameUpdateDraft) {}
}

export class ClearOrganisationNameUpdate implements Action {
  public readonly type = CLEAR_ORGANISATION_NAME_UPDATE;
}

export class OrganisationUpdateName implements Action {
  public readonly type = ORGANISATION_UPDATE_NAME;
  constructor(public payload: string) {}
}

export class OrganisationUpdateNameSuccess implements Action {
  public readonly type = ORGANISATION_UPDATE_NAME_SUCCESS;
  constructor(public payload: string) {}
}

export class OrganisationUpdateNameError implements Action {
  public readonly type = ORGANISATION_UPDATE_NAME_ERROR;
  constructor(public payload: any) {}
}

export class InitialiseOrganisationSraUpdate implements Action {
  public readonly type = INITIALISE_ORGANISATION_SRA_UPDATE;
  constructor(public payload: OrganisationSraUpdateDraft) {}
}

export class UpdateOrganisationSraDraft implements Action {
  public readonly type = UPDATE_ORGANISATION_SRA_DRAFT;
  constructor(public payload: OrganisationSraUpdateDraft) {}
}

export class ClearOrganisationSraUpdate implements Action {
  public readonly type = CLEAR_ORGANISATION_SRA_UPDATE;
}

export class OrganisationUpdateSra implements Action {
  public readonly type = ORGANISATION_UPDATE_SRA;
  constructor(public payload: string) {}
}

export class OrganisationUpdateSraSuccess implements Action {
  public readonly type = ORGANISATION_UPDATE_SRA_SUCCESS;
  constructor(public payload: string) {}
}

export class OrganisationUpdateSraError implements Action {
  public readonly type = ORGANISATION_UPDATE_SRA_ERROR;
  constructor(public payload: any) {}
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
  | OrganisationUpdateUpdateProfileIds
  | LoadOrganisationAccessTypes
  | LoadOrganisationAccessTypesSuccess
  | LoadOrganisationAccessTypesFailWith400
  | LoadOrganisationAccessTypesFailWith401
  | LoadOrganisationAccessTypesFailWith5xx
  | InitialiseOrganisationAddressUpdate
  | UpdateOrganisationAddressDraft
  | ClearOrganisationAddressUpdate
  | OrganisationUpdateAddress
  | OrganisationUpdateAddressSuccess
  | OrganisationUpdateAddressError
  | InitialiseOrganisationNameUpdate
  | UpdateOrganisationNameDraft
  | ClearOrganisationNameUpdate
  | OrganisationUpdateName
  | OrganisationUpdateNameSuccess
  | OrganisationUpdateNameError
  | InitialiseOrganisationSraUpdate
  | UpdateOrganisationSraDraft
  | ClearOrganisationSraUpdate
  | OrganisationUpdateSra
  | OrganisationUpdateSraSuccess
  | OrganisationUpdateSraError
  | LoadOrganisationAccessTypesFail;
