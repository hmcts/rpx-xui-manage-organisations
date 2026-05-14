export type ManageOrgUser = {
  email?: string;
  firstName?: string;
  idamStatus?: string;
  lastName?: string;
  roles?: unknown[];
  userIdentifier?: string;
};

export type OrganisationDetailsResponse = {
  contactInformation?: unknown[];
  name?: string;
  organisationIdentifier?: string;
  status?: string;
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
