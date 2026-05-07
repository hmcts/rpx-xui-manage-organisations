export type RegisterOrganisationData = {
  organisationName: string;
  companyHouseNumber: string;
  postcode: string;
  dxNumber: string;
  dxExchange: string;
  regulatorNumber: string;
  regulatorName: string;
  pbaNumbers: string[];
  firstName: string;
  lastName: string;
  email: string;
  individualRegulatorName: string;
  individualRegulatorNumber: string;
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
    companyHouseNumber: randomDigits(8),
    postcode: 'SW1A 1AA',
    dxNumber: randomDigits(10),
    dxExchange: randomDigits(10),
    regulatorNumber: randomDigits(10),
    regulatorName: `PW regulator ${randomDigits(5)}`,
    pbaNumbers: [`PBA${randomDigits(7)}`, `PBA${randomDigits(7)}`],
    firstName: 'Playwright',
    lastName: `User${randomDigits(5)}`,
    email: `pw.manageorg.${uniqueId}@example.com`,
    individualRegulatorName: `PW individual regulator ${randomDigits(5)}`,
    individualRegulatorNumber: randomDigits(8)
  };
};
