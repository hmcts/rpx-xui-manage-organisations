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
    dxExchange: null
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
});
