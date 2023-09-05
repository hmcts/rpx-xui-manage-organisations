import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationData } from '../../models/registrationdata.model';
import { ContactDetailsComponent } from './contact-details.component';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;

  const registrationData: RegistrationData = {
    name: '',
    hasDxReference: true,
    dxNumber: '931NR',
    dxExchange: 'MIDDLESEX',
    hasPBA: null,
    contactDetails: {
      firstName: 'John',
      lastName: 'Davis',
      workEmailAddress: 'john.davis@testorganisation.com'
    },
    hasRegisteredWithRegulator: null,
    services: [],
    address: null,
    organisationType: null,
    regulators: [],
    regulatorRegisteredWith: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactDetailsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the form control values', () => {
    component.registrationData = registrationData;
    component.setFormControlValues();
    expect(component.contactDetailsFormGroup.get('firstName').value).toEqual('John');
    expect(component.contactDetailsFormGroup.get('lastName').value).toEqual('Davis');
    expect(component.contactDetailsFormGroup.get('workEmailAddress').value).toEqual('john.davis@testorganisation.com');
  });
});
