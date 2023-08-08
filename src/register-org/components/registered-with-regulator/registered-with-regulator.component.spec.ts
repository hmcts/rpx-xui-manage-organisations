import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegistrationData } from '../../models/registrationdata.model';
import { RegisteredWithRegulatorComponent } from './registered-with-regulator.component';

describe('RegisteredWithRegulatorComponent', () => {
  let component: RegisteredWithRegulatorComponent;
  let fixture: ComponentFixture<RegisteredWithRegulatorComponent>;

  const registrationData: RegistrationData = {
    name: '',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    hasPBA: null,
    contactDetails: null,
    hasRegisteredWithRegulator: null,
    services: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisteredWithRegulatorComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredWithRegulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the yes radio button form control', () => {
    component.registrationData = registrationData;
    component.registrationData.hasRegisteredWithRegulator = true;
    component.setFormControlValues();
    expect(component.registeredWithRegulatorFormGroup.get('registeredWithRegulator').value).toEqual('yes');
  });

  it('should set the no radio button form control', () => {
    component.registrationData = registrationData;
    component.registrationData.hasRegisteredWithRegulator = false;
    component.setFormControlValues();
    expect(component.registeredWithRegulatorFormGroup.get('registeredWithRegulator').value).toEqual('no');
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
      fieldId: 'registered-with-regulator-yes'
    };
    component.registeredWithRegulatorFormGroup.get('registeredWithRegulator').setValue(null);
    component.onContinue();
    expect(component.registeredWithRegulatorError).toEqual(errorMessage);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });
});
