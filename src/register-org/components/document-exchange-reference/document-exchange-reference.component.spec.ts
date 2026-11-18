import { DocumentExchangeReferenceComponent } from './document-exchange-reference.component';

describe('DocumentExchangeReferenceComponent', () => {
  let router;
  let registerOrgService;
  let component: DocumentExchangeReferenceComponent;

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
      hasDxReference: null,
      dxNumber: '123',
      dxExchange: 'LONDON'
    });
    component = new DocumentExchangeReferenceComponent(router, registerOrgService);
    component.ngOnInit();
  });

  it('should continue to DX details when yes is submitted', () => {
    component.onContinue(true);

    expect(component.registrationData.hasDxReference).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'document-exchange-reference-details']);
  });

  it('should clear DX details and continue when no is submitted', () => {
    component.onContinue(false);

    expect(component.registrationData.hasDxReference).toBeFalse();
    expect(component.registrationData.dxNumber).toBeNull();
    expect(component.registrationData.dxExchange).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'regulatory-organisation-type']);
  });

  it('should navigate back to the registered address', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'registered-address', 'internal']);
  });
});
