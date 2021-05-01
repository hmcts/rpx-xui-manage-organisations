import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { Action, Store } from '@ngrx/store';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { of } from 'rxjs';
import { PbaNumbersFormComponent } from '..';
import { OrganisationDetails } from '../../../models/organisation.model';

const storeMock = {
  pipe: () => {
  },
  dispatch: (action: Action) => {
  }
};

let pipeSpy: jasmine.Spy;
let dispatchSpy: jasmine.Spy;

const mockOrganisationDetails: OrganisationDetails = {
  name: 'A Firm',
  organisationIdentifier: 'A111111',
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
  paymentAccount: [{pbaNumber: 'PBA000000'}],
  pendingAddPaymentAccount: [],
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
        ExuiCommonLibModule.forChild(),
        RouterTestingModule.withRoutes([]),
        RxReactiveFormsModule
      ],
      providers: [
        {
          provide: Store,
          useValue: storeMock
        },
      ],
      declarations: [PbaNumbersFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
