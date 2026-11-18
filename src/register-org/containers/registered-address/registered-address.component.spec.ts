import { RegisteredAddressComponent } from './registered-address.component';

describe('RegisteredAddressComponent', () => {
  const address = {
    addressLine1: '1 High Street',
    addressLine2: null,
    addressLine3: null,
    postTown: 'London',
    county: null,
    country: 'UK',
    postCode: 'SW1A 1AA'
  };
  let router;
  let registerOrgService;
  let component: RegisteredAddressComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate', 'currentNavigation']);
    router.currentNavigation.and.returnValue(null);
    registerOrgService = jasmine.createSpyObj(
      'RegisterOrgService',
      ['getRegistrationData', 'persistRegistrationData', 'removeRegistrationData']
    );
    registerOrgService.REGISTER_ORG_NEW_ROUTE = 'register-org-new';
    registerOrgService.CHECK_YOUR_ANSWERS_ROUTE = 'check-your-answers';
    registerOrgService.getRegistrationData.and.returnValue({
      address,
      inInternationalMode: false
    });
    component = new RegisteredAddressComponent(
      router,
      registerOrgService,
      { snapshot: { params: { internal: 'internal' } } } as any
    );
    component.ngOnInit();
  });

  it('should expose the persisted address to the shared entry component', () => {
    expect(component.initialAddress).toBe(address as any);
    expect(component.initialInternationalMode).toBeFalse();
    expect(component.isInternal).toBeTrue();
  });

  it('should persist the submitted address and continue', () => {
    component.onContinue({ address: address as any, inInternationalMode: false });

    expect(component.registrationData.address).toBe(address as any);
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'document-exchange-reference']);
  });

  it('should navigate back to the external address entry when resetting', () => {
    component.onBack(true);

    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'registered-address', 'external']);
  });

  it('should navigate back to company details from postcode entry', () => {
    component.onBack(false);

    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'company-house-details']);
  });
});
