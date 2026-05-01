export type RegisterOrganisationData = {
  organisationName: string;
  postcode: string;
  dxNumber: string;
  dxExchange: string;
  regulatorNumber: string;
  firstName: string;
  lastName: string;
  email: string;
};

const randomDigits = (length: number): string => {
  let digits = '';
  for (let index = 0; index < length; index++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return digits;
};

export const createRegisterOrganisationData = (): RegisterOrganisationData => {
  const uniqueId = `${Date.now()}${randomDigits(4)}`;

  return {
    organisationName: `PW ManageOrg ${uniqueId}`,
    postcode: 'SW1A 1AA',
    dxNumber: randomDigits(10),
    dxExchange: randomDigits(10),
    regulatorNumber: randomDigits(10),
    firstName: 'Playwright',
    lastName: `User${randomDigits(5)}`,
    email: `pw.manageorg.${uniqueId}@example.com`
  };
};
