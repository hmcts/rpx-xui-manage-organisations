import {
  CompanyHouseDetailsMessage,
  ContactDetailsErrorMessage,
  DxDetailsMessage,
  OrganisationServicesMessage,
  PbaErrorMessage,
  RegulatoryOrganisationTypeMessage,
  RegulatoryType,
  RegulatorType
} from './index';
import { OrgTypeMessageEnum } from './organisation-type.enum';

describe('Register org models', () => {
  it('should expose registration message enums', () => {
    expect(CompanyHouseDetailsMessage.NO_ORG_NAME).toEqual('Enter an organisation name');
    expect(DxDetailsMessage.INVALID_DX_NUMBER).toEqual('Enter valid DX number');
    expect(OrganisationServicesMessage.NO_ORG_SERVICES).toEqual('Please select at least one service');
    expect(PbaErrorMessage.UNIQUE_ERROR_MESSAGE).toEqual('You have entered this PBA number more than once');
  });

  it('should expose regulator and contact detail enums', () => {
    expect(ContactDetailsErrorMessage.WORK_EMAIL_ADDRESS).toEqual('Enter email address');
    expect(RegulatorType.Individual).toEqual('IND');
    expect(RegulatoryType.NotApplicable).toEqual('Not Applicable');
    expect(RegulatoryOrganisationTypeMessage.DUPLICATE_REGULATOR_BANNER).toEqual('Enter valid registration details');
  });

  it('should expose organisation type validation messages', () => {
    expect(OrgTypeMessageEnum.NO_ORG_SELECTED).toEqual('Please select an organisation');
    expect(OrgTypeMessageEnum.NO_ORG_TYPE_SELECTED).toEqual('Select an organisation type');
    expect(OrgTypeMessageEnum.NO_ORG_DETAIS).toEqual('Please enter the details');
  });
});
