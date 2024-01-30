import { of } from 'rxjs';
import { RegistrationData } from '../models/registration-data.model';
import { RegisterOrgService } from './register-org.service';

const registrationData: RegistrationData = {
  pbaNumbers: [],
  companyName: '',
  companyHouseNumber: null,
  hasDxReference: null,
  dxNumber: null,
  dxExchange: null,
  services: [],
  hasPBA: null,
  contactDetails: null,
  hasIndividualRegisteredWithRegulator: null,
  address: null,
  organisationType: null,
  regulators: [],
  regulatorRegisteredWith: null,
  inInternationalMode: null
};

describe('RegisterOrgService', () => {
  const mockSessionStorageService = jasmine.createSpyObj('SessionStorageService', [
    'getItem',
    'setItem',
    'removeItem'
  ]);

  const mockHttpService = jasmine.createSpyObj('mockHttpService', ['get', 'post']);
  mockHttpService.post.and.returnValue(of({}));

  it('should get registration data', () => {
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(registrationData));
    const service = new RegisterOrgService(mockSessionStorageService, mockHttpService);
    const registrationDataResult = service.getRegistrationData();
    expect(registrationDataResult).toEqual(registrationData);
    expect(mockSessionStorageService.getItem).toHaveBeenCalled();
  });

  it('should persist registration data', () => {
    mockSessionStorageService.setItem.and.callThrough();
    const service = new RegisterOrgService(mockSessionStorageService, mockHttpService);
    service.persistRegistrationData(registrationData);
    expect(mockSessionStorageService.setItem).toHaveBeenCalled();
  });

  it('should remove registration data', () => {
    mockSessionStorageService.removeItem.and.callThrough();
    const service = new RegisterOrgService(mockSessionStorageService, mockHttpService);
    service.removeRegistrationData();
    expect(mockSessionStorageService.removeItem).toHaveBeenCalled();
  });
});
