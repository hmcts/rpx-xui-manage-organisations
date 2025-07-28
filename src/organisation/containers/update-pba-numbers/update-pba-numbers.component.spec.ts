import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromRoot from '../../../app/store';
import { DxAddress, OrganisationContactInformation, OrganisationDetails } from '../../../models';
import * as fromOrgStore from '../../../users/store';
import { UpdatePbaNumbersComponent } from './update-pba-numbers.component';
import { AppConstants } from '../../../app/app.constants';

const storeMock = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  pipe: () => <unknown>{},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => { }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let pipeSpy: jasmine.Spy;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let dispatchSpy: jasmine.Spy;

describe('UpdatePbaNumbersComponent', () => {
  let component: UpdatePbaNumbersComponent;
  let fixture: ComponentFixture<UpdatePbaNumbersComponent>;
  let store: Store<fromOrgStore.UserState>;
  let activatedRoute: any;
  const dxAddress: DxAddress = {
    dxNumber: 'DX 4534234552',
    dxExchange: 'London'
  };

  const contactInformation: OrganisationContactInformation = {
    addressLine1: '23',
    addressLine2: '',
    addressLine3: '',
    townCity: 'Aldgate East',
    county: 'London',
    country: '',
    postCode: 'AT54RT',
    dxAddress: [dxAddress]
  };

  /**
   * Mock organisation data is representative of data returned from the Node layer.
   */
  const mockOrganisationDetails: OrganisationDetails = {
    name: 'Luke Solicitors',
    organisationIdentifier: 'HAUN33E',
    organisationProfileIds: [
      AppConstants.OGD_PROFILE_TYPES.SOLICITOR_PROFILE
    ],
    contactInformation: [contactInformation],
    status: 'ACTIVE',
    sraId: 'SRA1298455554',
    sraRegulated: false,
    superUser: {
      firstName: 'Luke',
      lastName: 'Wilson',
      email: 'lukesuperuserxui@mailnesia.com'
    },
    paymentAccount: [{ pbaNumber: 'test' }],
    pendingAddPaymentAccount: [],
    pendingRemovePaymentAccount: [],
    pendingPaymentAccount: undefined
  };

  beforeEach(() => {
    activatedRoute = {
      snapshot: {
        params: of({})
      }
    };
    pipeSpy = spyOn(storeMock, 'pipe').and.returnValue(of(mockOrganisationDetails));

    dispatchSpy = spyOn(storeMock, 'dispatch');

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromOrgStore.reducers)
        })
      ],
      declarations: [UpdatePbaNumbersComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: storeMock
        },
        { provide: ActivatedRoute, useValue: activatedRoute },
        UpdatePbaNumbersComponent
      ]
    }).compileComponents();

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(UpdatePbaNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have retrieved the Organisation Details from the Store on component initialisation', () => {
    expect(store.pipe).toHaveBeenCalled();
    expect(component.organisationDetails).toEqual(mockOrganisationDetails);
  });
});
