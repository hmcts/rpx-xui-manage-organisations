import { DocumentExchangeReferenceDetailsComponent } from './document-exchange-reference-details.component';

describe('DocumentExchangeReferenceDetailsComponent', () => {
  let router;
  let registerOrgService;
  let component: DocumentExchangeReferenceDetailsComponent;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate', 'currentNavigation']);
    router.currentNavigation.and.returnValue(null);
    registerOrgService = jasmine.createSpyObj(
      'RegisterOrgService',
      ['getRegistrationData', 'persistRegistrationData', 'removeRegistrationData']
    );
    registerOrgService.REGISTER_ORG_NEW_ROUTE = 'register-org-new';
    registerOrgService.CHECK_YOUR_ANSWERS_ROUTE = 'check-your-answers';
    registerOrgService.getRegistrationData.and.returnValue({ dxNumber: '123', dxExchange: 'LONDON' });
    component = new DocumentExchangeReferenceDetailsComponent(router, registerOrgService);
    component.ngOnInit();
  });

  it('should save submitted details and continue', () => {
    component.onContinue({ dxNumber: '456', dxExchange: 'MANCHESTER' });

    expect(component.registrationData.dxNumber).toBe('456');
    expect(component.registrationData.dxExchange).toBe('MANCHESTER');
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'regulatory-organisation-type']);
  });

  it('should navigate back to the DX question', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'document-exchange-reference']);
  });
});
