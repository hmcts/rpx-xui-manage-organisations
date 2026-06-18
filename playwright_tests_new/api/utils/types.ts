export type ManageOrgUser = {
  email?: string;
  firstName?: string;
  idamStatus?: string;
  lastName?: string;
  roles?: unknown[];
  userIdentifier?: string;
};

export type CaseShareUser = {
  caseRoles?: string[];
  email?: string;
  firstName?: string;
  idamId?: string;
  lastName?: string;
};

export type DxAddress = {
  dxExchange?: string;
  dxNumber?: string;
};

export type ContactInformation = {
  addressLine1?: string;
  addressLine2?: string;
  dxAddress?: DxAddress[];
  postCode?: string;
  townCity?: string;
};

export type OrganisationDetailsResponse = {
  contactInformation?: ContactInformation[];
  name?: string;
  organisationIdentifier?: string;
  paymentAccount?: string[];
  sraId?: string;
  sraRegulated?: boolean;
  status?: string;
};

export type FeeAccount = {
  account_name?: string | null;
  account_number?: string;
  available_balance?: number;
  credit_limit?: number | null;
  effective_date?: string;
  status?: string | null;
};

export type MutatingApiResult = {
  code?: number;
  message?: string;
};

export type ReferenceItem = {
  id?: string;
  [key: string]: unknown;
};

export type RuntimeConfiguration = {
  idamWeb?: string;
  manageCaseLink?: string;
  manageOrgLink?: string;
  protocol?: string;
  termsAndConditionsEnabled?: boolean;
};

export type UserListResponse = {
  users?: ManageOrgUser[];
};

export type UserSessionResponse = {
  email?: string;
  orgId?: string;
  roles?: unknown[];
  sessionTimeout?: unknown;
  userId?: string;
};
