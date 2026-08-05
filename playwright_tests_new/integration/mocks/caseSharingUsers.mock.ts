export interface CaseShareUser {
  idamId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const petSolicitorOne: CaseShareUser = {
  idamId: 'pet-solicitor-one-idam-id',
  email: 'div-petsol-1@example.com',
  firstName: 'Pet',
  lastName: 'Solicitor 1'
};

export const petSolicitorTwo: CaseShareUser = {
  idamId: 'pet-solicitor-two-idam-id',
  email: 'div-petsol-2@example.com',
  firstName: 'Pet',
  lastName: 'Solicitor 2'
};

export const buildRecipientOptionName = (recipient: CaseShareUser): string =>
  `${recipient.firstName} ${recipient.lastName} - ${recipient.email}`;

export const buildRecipientName = (recipient: CaseShareUser): string =>
  `${recipient.firstName} ${recipient.lastName}`;
