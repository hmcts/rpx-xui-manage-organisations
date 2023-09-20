import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegistrationData } from '../../models/registration-data.model';
import { DocumentExchangeReferenceComponent } from './document-exchange-reference.component';

describe('DocumentExchangeReferenceComponent', () => {
  let component: DocumentExchangeReferenceComponent;
  let fixture: ComponentFixture<DocumentExchangeReferenceComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  const registrationData: RegistrationData = {
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
    regulatorRegisteredWith: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentExchangeReferenceComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentExchangeReferenceComponent);
    component = fixture.componentInstance;
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
    const errorMessage: ErrorMessage = {
      description: 'Please select at least one option',
      title: '',
      fieldId: 'document-exchange-yes'
    };
    component.dxFormGroup.get('documentExchange').setValue(null);
    component.onContinue();
    expect(component.dxError).toEqual(errorMessage);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
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
