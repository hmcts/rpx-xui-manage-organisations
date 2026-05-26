export interface RegisterOrganisationLovEntry {
  active_flag: string;
  category_key: string;
  child_nodes: RegisterOrganisationLovEntry[] | null;
  hint_text_cy: string;
  hint_text_en: string;
  key: string;
  lov_order: number | null;
  parent_category: string;
  parent_key: string;
  value_cy: string;
  value_en: string;
}

export interface RegisterOrganisationAddress {
  addressLine1: string;
  addressLine2?: string | null;
  addressLine3?: string | null;
  county?: string | null;
  country: string;
  postCode?: string | null;
  postTown: string;
}

export interface RegisterOrganisationRegulator {
  organisationRegistrationNumber?: string;
  regulatorName?: string;
  regulatorType: string;
}

export interface RegisterOrganisationSubmission {
  address: RegisterOrganisationAddress;
  companyHouseNumber?: string | null;
  companyName: string;
  contactDetails: {
    firstName: string;
    lastName: string;
    workEmailAddress: string;
  };
  dxExchange?: string | null;
  dxNumber?: string | null;
  hasDxReference: boolean;
  hasIndividualRegisteredWithRegulator: boolean;
  hasPBA: boolean;
  inInternationalMode: boolean;
  individualRegulators: RegisterOrganisationRegulator[];
  organisationType: {
    description: string;
    key: string;
  };
  otherOrganisationDetail?: string | null;
  otherOrganisationType?: {
    description: string;
    key: string;
  } | null;
  otherServices?: string | null;
  pbaNumbers: string[];
  regulatorRegisteredWith?: string | null;
  regulators: RegisterOrganisationRegulator[];
  services: Array<{
    key: string;
    value: string;
  }>;
  sraRegulated?: boolean;
}

const lovEntry = (
  categoryKey: string,
  key: string,
  value: string,
  childNodes: RegisterOrganisationLovEntry[] | null = null
): RegisterOrganisationLovEntry => ({
  active_flag: 'Y',
  category_key: categoryKey,
  child_nodes: childNodes,
  hint_text_cy: '',
  hint_text_en: '',
  key,
  lov_order: null,
  parent_category: '',
  parent_key: '',
  value_cy: '',
  value_en: value
});

export const otherOrganisationType = lovEntry('OtherOrgType', 'CharteredSurveyors', 'Chartered surveyors');

export const organisationTypeLovResponse: RegisterOrganisationLovEntry[] = [
  lovEntry('OrgType', 'SolicitorOrganisation', 'Solicitor'),
  lovEntry('OrgType', 'LocalAuthority', 'Local Authority'),
  lovEntry('OrgType', 'OTHER', 'Other', [
    otherOrganisationType,
    lovEntry('OtherOrgType', 'Education', 'Education')
  ])
];

export const regulatoryOrganisationTypesResponse = [
  { name: 'Solicitor Regulation Authority (SRA)', id: 'SRA' },
  { name: 'Financial Conduct Authority (FCA)', id: 'FCA' },
  { name: 'Other', id: 'Other' },
  { name: 'Not Applicable', id: 'NA' }
];

export const optionalOtherOrganisationRegistration = {
  companyHouseNumber: '11223344',
  companyName: 'PW Integration Other Organisation LLP',
  contactDetails: {
    firstName: 'Paula',
    lastName: 'Integration',
    workEmailAddress: 'paula.integration@example.com'
  },
  dxExchange: 'London 42',
  dxNumber: 'DX1234567890',
  individualRegulatorName: 'Individual Integration Regulator',
  individualRegulatorNumber: 'IND-REG-001',
  manualUkAddress: {
    addressLine1: 'Integration House',
    addressLine2: '42 Test Street',
    addressLine3: 'Register Wing',
    county: 'Greater London',
    country: 'UK',
    postCode: 'SW1V 3BZ',
    postTown: 'London'
  },
  organisationRegulatorName: 'Organisation Integration Regulator',
  organisationRegulatorNumber: 'ORG-REG-001',
  otherOrganisationDetail: 'Litigation support and case administration services',
  pbaNumbers: ['PBA1234567', 'PBA7654321'],
  services: [
    { key: 'ABA1', value: 'Divorce' },
    { key: 'AAA7', value: 'Damages' }
  ]
};

export const optionalSolicitorRegistration = {
  companyHouseNumber: '55667788',
  companyName: 'PW Integration Optional Solicitors LLP',
  contactDetails: {
    firstName: 'Sam',
    lastName: 'Solicitor',
    workEmailAddress: 'sam.solicitor@example.com'
  },
  dxExchange: 'London 84',
  dxNumber: 'DX9988776655',
  individualRegulatorName: 'Optional Individual Regulator',
  individualRegulatorNumber: 'OPT-IND-001',
  manualUkAddress: {
    addressLine1: 'Solicitor Integration House',
    addressLine2: '84 Optional Street',
    addressLine3: 'Solicitor Wing',
    county: 'Greater London',
    country: 'UK',
    postCode: 'SW1V 4BZ',
    postTown: 'London'
  },
  organisationRegulatorName: 'Optional Organisation Regulator',
  organisationRegulatorNumber: 'OPT-ORG-001',
  pbaNumbers: ['PBA1122334', 'PBA4433221'],
  services: [
    { key: 'ABA1', value: 'Divorce' },
    { key: 'AAA7', value: 'Damages' }
  ]
};

export const minimumSolicitorRegistration = {
  companyName: 'PW Integration Solicitors LLP',
  contactDetails: {
    firstName: 'Mina',
    lastName: 'Solicitor',
    workEmailAddress: 'mina.solicitor@example.com'
  },
  manualInternationalAddress: {
    addressLine1: 'International Integration House',
    addressLine2: null,
    addressLine3: null,
    county: null,
    country: 'Ireland',
    postCode: null,
    postTown: 'Dublin'
  },
  organisationRegulatorNumber: 'SRA-REG-002',
  services: [
    { key: 'ABA1', value: 'Divorce' },
    { key: 'AAA7', value: 'Damages' }
  ]
};

export const successfulRegistrationResponse = {
  organisationIdentifier: 'ORG-PW-4635',
  status: 'PENDING'
};

export const registrationCannotBeCompletedResponse = {
  errorDescription: 'Registration cannot be completed',
  errorMessage: '6 : PBA_NUMBER Invalid or already exists'
};
