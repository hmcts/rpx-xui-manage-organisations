import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationData } from '../../models/registrationdata.model';
import { DocumentExchangeReferenceDetailsComponent } from './document-exchange-reference-details.component';

describe('DocumentExchangeReferenceComponent', () => {
  let component: DocumentExchangeReferenceDetailsComponent;
  let fixture: ComponentFixture<DocumentExchangeReferenceDetailsComponent>;

  const registrationData: RegistrationData = {
    name: '',
    hasDxReference: true,
    dxNumber: '931NR',
    dxExchange: 'MIDDLESEX',
    contactDetails: null,
    hasRegisteredWithRegulator: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentExchangeReferenceDetailsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentExchangeReferenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the form control values', () => {
    component.registrationData = registrationData;
    component.setFormControlValues();
    expect(component.dxFormGroup.get('dxNumber').value).toEqual('931NR');
    expect(component.dxFormGroup.get('dxExchange').value).toEqual('MIDDLESEX');
  });
});
