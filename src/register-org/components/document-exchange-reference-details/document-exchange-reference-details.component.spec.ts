import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationData } from '../../models/registration-data.model';
import { DocumentExchangeReferenceDetailsComponent } from './document-exchange-reference-details.component';

describe('DocumentExchangeReferenceComponent', () => {
  let component: DocumentExchangeReferenceDetailsComponent;
  let fixture: ComponentFixture<DocumentExchangeReferenceDetailsComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  const registrationData: RegistrationData = {
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
    regulatorRegisteredWith: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentExchangeReferenceDetailsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentExchangeReferenceDetailsComponent);
    component = fixture.componentInstance;
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

  it('should back link navigate to the correct page', () => {
    spyOn(component, 'navigateToPreviousPage');
    component.onBack();
    expect(component.navigateToPreviousPage).toHaveBeenCalled();
  });
});
