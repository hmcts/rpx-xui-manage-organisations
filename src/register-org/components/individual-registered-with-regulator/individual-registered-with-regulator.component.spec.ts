import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegistrationData } from '../../models/registrationdata.model';
import { IndividualRegisteredWithRegulatorComponent } from './individual-registered-with-regulator.component';

describe('IndividualRegisteredWithRegulatorComponent', () => {
  let component: IndividualRegisteredWithRegulatorComponent;
  let fixture: ComponentFixture<IndividualRegisteredWithRegulatorComponent>;

  const registrationData: RegistrationData = {
    name: '',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    hasPBA: null,
    contactDetails: null,
    hasIndividualRegisteredWithRegulator: null,
    services: [],
    address: null,
    organisationType: null,
    regulators: [],
    regulatorRegisteredWith: null,
    pbaNumbers: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualRegisteredWithRegulatorComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualRegisteredWithRegulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the yes radio button form control', () => {
    component.registrationData = registrationData;
    component.registrationData.hasIndividualRegisteredWithRegulator = true;
    component.setFormControlValues();
    expect(component.registeredWithRegulatorFormGroup.get('registeredWithRegulator').value).toEqual('yes');
  });

  it('should set the no radio button form control', () => {
    component.registrationData = registrationData;
    component.registrationData.hasIndividualRegisteredWithRegulator = false;
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

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
