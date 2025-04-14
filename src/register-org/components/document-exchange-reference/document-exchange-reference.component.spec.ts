import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationData } from '../../models/registration-data.model';
import { DocumentExchangeReferenceComponent } from './document-exchange-reference.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DocumentExchangeReferenceComponent', () => {
  let component: DocumentExchangeReferenceComponent;
  let fixture: ComponentFixture<DocumentExchangeReferenceComponent>;
  let router: Router;

  const registrationData: RegistrationData = {
    pbaNumbers: [],
    companyName: '',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DocumentExchangeReferenceComponent],
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentExchangeReferenceComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the yes radio button form control', () => {
    component.registrationData = registrationData;
    component.registrationData.hasDxReference = true;
    component.setFormControlValues();
    expect(component.dxFormGroup.get('documentExchange').value).toEqual('yes');
  });

  it('should set the no radio button form control', () => {
    component.registrationData = registrationData;
    component.registrationData.hasDxReference = false;
    component.setFormControlValues();
    expect(component.dxFormGroup.get('documentExchange').value).toEqual('no');
  });

  it('should set the error message if none of the radio option is selection', () => {
    const scrollIntoViewSpy = jasmine.createSpy();
    component.errorSummaryTitleElement = {
      nativeElement: {
        scrollIntoView: scrollIntoViewSpy
      }
    };
    const errorMessages = [{
      message: 'Please select an option',
      id: 'document-exchange-yes'
    }];
    component.dxFormGroup.get('documentExchange').setValue(null);
    component.onContinue();
    expect(component.dxErrors).toEqual(errorMessages);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  it('should navigate to document exchange details page', () => {
    component.registrationData.hasDxReference = null;
    component.dxFormGroup.get('documentExchange').setValue('yes');
    component.onContinue();
    expect(component.registrationData.hasDxReference).toEqual(true);
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'document-exchange-reference-details']);
  });

  it('should navigate to regulatory organisation type page', () => {
    component.registrationData = registrationData;
    component.registrationData.hasDxReference = true;
    component.registrationData.dxExchange = 'DX Exchange';
    component.registrationData.dxNumber = '12345';
    component.dxFormGroup.get('documentExchange').setValue('no');
    component.onContinue();
    expect(component.registrationData.hasDxReference).toEqual(false);
    expect(component.registrationData.dxNumber).toBeNull();
    expect(component.registrationData.dxExchange).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'regulatory-organisation-type']);
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });

  it('should back link navigate to the check your answers page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/check-your-answers'
      }
    } as any);
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  it('should back link navigate to the registered address page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'registered-address', 'internal']);
  });
});
