export type RegisterOrganisationData = {
  organisationName: string;
  companyHouseNumber: string;
  lookupPostcode: string;
  manualUkAddress: RegisterOrganisationAddress;
  manualInternationalAddress: RegisterOrganisationAddress;
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

export type RegisterOrganisationAddress = {
  line1: string;
  line2?: string;
  line3?: string;
  town: string;
  county?: string;
  postcode?: string;
  country: string;
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
    lookupPostcode: 'SW1A 1AA',
    manualUkAddress: {
      line1: `PW building ${uniqueId}`,
      line2: 'PW address line 2',
      line3: 'PW address line 3',
      town: 'London',
      county: 'Greater London',
      postcode: 'SW1V 3BZ',
      country: 'UK'
    },
    manualInternationalAddress: {
      line1: `PW international building ${uniqueId}`,
      town: 'Dublin',
      country: 'Ireland'
    },
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
