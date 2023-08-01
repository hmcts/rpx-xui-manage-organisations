import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegistrationData } from '../../models/registrationdata.model';
import { DocumentExchangeReferenceComponent } from './document-exchange-reference.component';

describe('DocumentExchangeReferenceComponent', () => {
  let component: DocumentExchangeReferenceComponent;
  let fixture: ComponentFixture<DocumentExchangeReferenceComponent>;

  const registrationData: RegistrationData = {
    name: '',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentExchangeReferenceComponent],
      imports: [RouterTestingModule]
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

  it('should set the correct radio button form control', () => {
    component.registrationData = registrationData;
    component.setFormControlValues();
    expect(component.dxFormGroup.get('documentExchange').value).toEqual(null);

    registrationData.hasDxReference = true;
    component.registrationData = registrationData;
    component.setFormControlValues();
    expect(component.dxFormGroup.get('documentExchange').value).toEqual('yes');

    registrationData.hasDxReference = false;
    component.registrationData = registrationData;
    component.setFormControlValues();
    expect(component.dxFormGroup.get('documentExchange').value).toEqual('no');
  });
});
