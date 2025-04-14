import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DxDetailsMessage } from '../../../register-org/models';
import { RegistrationData } from '../../models/registration-data.model';
import { DocumentExchangeReferenceDetailsComponent } from './document-exchange-reference-details.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DocumentExchangeReferenceComponent', () => {
  let component: DocumentExchangeReferenceDetailsComponent;
  let fixture: ComponentFixture<DocumentExchangeReferenceDetailsComponent>;
  let router: Router;
  const dxNumberError = { message: DxDetailsMessage.INVALID_DX_NUMBER, id: 'dx-number' };
  const dxExchangeError = { message: DxDetailsMessage.INVALID_DX_EXCHANGE, id: 'dx-exchange' };

  const registrationData: RegistrationData = {
    pbaNumbers: [],
    companyName: '',
    hasDxReference: true,
    dxNumber: '931NR',
    dxExchange: 'MIDDLESEX',
    services: [],
    hasPBA: false,
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
    declarations: [DocumentExchangeReferenceDetailsComponent],
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentExchangeReferenceDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should set the form control values', () => {
    component.registrationData = registrationData;
    component.setFormControlValues();
    expect(component.dxFormGroup.get('dxNumber').value).toEqual('931NR');
    expect(component.dxFormGroup.get('dxExchange').value).toEqual('MIDDLESEX');
  });

  it('should verify the labels', () => {
    const dxNumberLabelEl = fixture.debugElement.nativeElement.querySelector('#dx-number-label');
    const dxExchangeLabelEl = fixture.debugElement.nativeElement.querySelector('#dx-exchange-label');
    expect(dxNumberLabelEl.textContent.trim()).toEqual('DX number (Optional)');
    expect(dxExchangeLabelEl.textContent.trim()).toEqual('DX exchange (Optional)');
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

  it('should back link navigate to the document exchange reference page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'document-exchange-reference']);
  });

  it('should set the validation error if DX number is invalid', () => {
    component.registrationData.dxNumber = '12345678912345';
    component.registrationData.dxExchange = '12345678912345678912';
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors[0]).toEqual(dxNumberError);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should set the validation error if DX number is invalid', () => {
    component.registrationData.dxNumber = '1234567891234';
    component.registrationData.dxExchange = '123456789123456789123';
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors[0]).toEqual(dxExchangeError);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should set the validation error if DX number & exchange is invalid', () => {
    component.registrationData.dxNumber = '12345678912345';
    component.registrationData.dxExchange = '123456789123456789123';
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(2);
    expect(component.validationErrors[0]).toEqual(dxNumberError);
    expect(component.validationErrors[1]).toEqual(dxExchangeError);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to the next page if DX number & exchange are valid', () => {
    component.registrationData.dxNumber = '1234567891234';
    component.registrationData.dxExchange = '12345678912345678912';
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'regulatory-organisation-type']);
  });

  it('should navigate to the next page if DX number & exchange are valid', () => {
    component.registrationData.dxNumber = '1234567891234';
    component.registrationData.dxExchange = '12345678912345678912';
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'regulatory-organisation-type']);
  });

  it('should navigate to the next page if DX number & exchange are empty', () => {
    component.registrationData.dxNumber = 'ABC';
    component.registrationData.dxExchange = 'ABC';
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'regulatory-organisation-type']);
  });
});
