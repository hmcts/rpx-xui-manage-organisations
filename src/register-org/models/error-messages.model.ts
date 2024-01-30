export enum CompanyHouseDetailsMessage {
  NO_ORG_NAME = 'Enter an organisation name',
  INVALID_COMPANY_NUMBER = 'Enter a valid Companies House number'
}

export enum DxDetailsMessage {
  INVALID_DX_NUMBER = 'Enter valid DX number',
  INVALID_DX_EXCHANGE = 'Enter valid DX exchange'
}

export enum OrganisationServicesMessage {
  NO_ORG_SERVICES = 'Please select at least one service',
  OTHER_SERVICES = 'Enter one or more services'
}

export enum PbaErrorMessage {
  GENERIC_ERROR_MESSAGE = 'Enter a valid PBA number',
  EXISTING_PBA_NUMBER = 'This PBA number is already associated to your organisation',
  UNIQUE_ERROR_MESSAGE = 'You have entered this PBA number more than once'
}
