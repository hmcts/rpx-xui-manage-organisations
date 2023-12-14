import { UserAccessType } from '@hmcts/rpx-xui-common-lib';

export interface RawPrdUsersList {
  organisationIdentifier: string;
  users: RawPrdUser[];
}

export interface RawPrdUserListWithoutRoles {
  organisationIdentifier: string;
  users: RawPrdUserLite[];
}

export interface RawPrdUserLite {
  userIdentifier: string;
  email: string;
  firstName: string;
  lastName: string;
  idamStatus: string;
  accessTypes?: UserAccessType[];
}

export interface RawPrdUser extends RawPrdUserLite {
  idamStatus: string;
  roles?: string[]; // pending users will not have roles - will be null
  idamMessage?: string;
  idamStatusCode?: string;
}

export interface PrdUser {
    userIdentifier: string;
    email: string;
    firstName: string;
    lastName: string;
    idamStatus: string;
    fullName: string;
    routerLink: string;
    routerLinkTitle: string;
    accessTypes: UserAccessType[];
    roles?: string[];
    status?: string;
    selected?: boolean;
}
