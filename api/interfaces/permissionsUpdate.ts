export interface PermissionsUpdate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  idamStatus: string;
  rolesAdd?: { name: string }[];
  rolesDelete?: { name: string }[];
  userAccessTypes?: {
    jurisdictionId: string;
    organisationProfileId: string;
    accessTypeId: string;
    enabled: boolean;
  }[];
}
