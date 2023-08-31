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
    services: [],
    hasPBA: false,
    contactDetails: null,
    hasRegisteredWithRegulator: null,
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

  it('should verify the labels', () => {
    const dxNumberLabelEl = fixture.debugElement.nativeElement.querySelector('#dx-number-label');
    const dxExchangeLabelEl = fixture.debugElement.nativeElement.querySelector('#dx-exchange-label');
    expect(dxNumberLabelEl.textContent.trim()).toEqual('DX number (Optional)');
    expect(dxExchangeLabelEl.textContent.trim()).toEqual('DX exchange (Optional)');
  });
});
