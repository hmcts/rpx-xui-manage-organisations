import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { of } from 'rxjs';

import { OrganisationDetails } from '../../../models/organisation.model';
import { PbaNumbersFormComponent } from './pba-numbers-form.component';

const storeMock = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  pipe: () => <unknown>{ },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => { }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let pipeSpy: jasmine.Spy;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let dispatchSpy: jasmine.Spy;

const mockOrganisationDetails: OrganisationDetails = {
  name: 'A Firm',
  organisationIdentifier: 'A111111',
  organisationProfileIds: [
    'SOLICITOR_PROFILE'
  ],
  contactInformation: [{
    addressLine1: '123 Street',
    addressLine2: 'A Town',
    addressLine3: null,
    townCity: 'City',
    county: null,
    country: 'England',
    postCode: 'A123 AAA',
    dxAddress: [{
      dxNumber: 'dx11111',
      dxExchange: 'dxExchange'
    }]
  }],
  status: '',
  sraId: '',
  sraRegulated: true,
  superUser: {
    firstName: 'James',
    lastName: 'Chris',
    email: 'James.Chris@test.com'
  },
  paymentAccount: [{ pbaNumber: 'PBA000000' }],
  pendingAddPaymentAccount: [],
  pendingPaymentAccount: [],
  pendingRemovePaymentAccount: []
};

describe('PbaNumbersFormComponent', () => {
  let component: PbaNumbersFormComponent;
  let fixture: ComponentFixture<PbaNumbersFormComponent>;

  beforeEach(() => {
    pipeSpy = spyOn(storeMock, 'pipe').and.returnValue(of(mockOrganisationDetails));
    dispatchSpy = spyOn(storeMock, 'dispatch');

    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        ReactiveFormsModule,
        ExuiCommonLibModule,
        RouterTestingModule.withRoutes([]),
        RxReactiveFormsModule
      ],
      providers: [
        {
          provide: Store,
          useValue: storeMock
        }
      ],
      declarations: [PbaNumbersFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PbaNumbersFormComponent);
    component = fixture.componentInstance;
    component.organisationDetails = mockOrganisationDetails;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAddNewBtnClicked()', () => {
    it('should add a new form control to the pba form', () => {
      const currentFormArrayCount = component.pbaNumbers.length;
      component.onAddNewBtnClicked();

      const newFormArrayCount = component.pbaNumbers.length;
      expect(newFormArrayCount).toEqual(currentFormArrayCount + 1);
    });
  });

  describe('onRemoveNewPbaNumberClicked()', () => {
    it('should remove a new form control to the pba form', () => {
      component.onAddNewBtnClicked();

      const currentFormArrayCount = component.pbaNumbers.length;

      component.onRemoveNewPbaNumberClicked(0);

      const newFormArrayCount = component.pbaNumbers.length;
      expect(newFormArrayCount).toEqual(currentFormArrayCount - 1);
    });
  });
});
