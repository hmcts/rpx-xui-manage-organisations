import { RegistrationData } from '../models/registrationdata.model';
import { RegisterOrgService } from './register-org.service';

const registrationData: RegistrationData = {
  name: '',
  hasDxReference: null,
  dxNumber: null,
  dxExchange: null,
  services: [],
  hasPBA: null,
  contactDetails: null,
  hasIndividualRegisteredWithRegulator: null,
  companyHouseNumber: null,
  address: null,
  organisationType: null,
  organisationNumber: null,
  regulators: [],
  regulatorRegisteredWith: null
};

describe('RegisterOrgService', () => {
  const mockSessionStorageService = jasmine.createSpyObj('SessionStorageService', [
    'getItem',
    'setItem',
    'removeItem'
  ]);

  it('should get registration data', () => {
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(registrationData));
    const service = new RegisterOrgService(mockSessionStorageService);
    const registrationDataResult = service.getRegistrationData();
    expect(registrationDataResult).toEqual(registrationData);
    expect(mockSessionStorageService.getItem).toHaveBeenCalled();
  });

  it('should persist registration data', () => {
    mockSessionStorageService.setItem.and.callThrough();
    const service = new RegisterOrgService(mockSessionStorageService);
    service.persistRegistrationData(registrationData);
    expect(mockSessionStorageService.setItem).toHaveBeenCalled();
  });

  it('should remove registration data', () => {
    mockSessionStorageService.removeItem.and.callThrough();
    const service = new RegisterOrgService(mockSessionStorageService);
    service.removeRegistrationData();
    expect(mockSessionStorageService.removeItem).toHaveBeenCalled();
  });
});
