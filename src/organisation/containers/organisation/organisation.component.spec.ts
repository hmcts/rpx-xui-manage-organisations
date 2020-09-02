import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {Action, combineReducers, select, Store, StoreModule} from '@ngrx/store';
import {BehaviorSubject, of} from 'rxjs';
import { OrganisationComponent } from './organisation.component';
import * as fromStore from '../../../users/store';
import * as fromRoot from '../../../app/store';
import {Organisation} from '../../organisation.model';

const storeMock = {
  pipe: () => {},
  dispatch: (action: Action) => {}
};
let pipeSpy: jasmine.Spy;
let dispatchSpy: jasmine.Spy;

describe('OrganisationComponent', () => {

  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;
  let store: Store<fromStore.UserState>;

  /**
   * Mock organisation data is representative of data returned from the Node layer.
   */
  const mockOrganisationDetails = {
    name: 'Luke Solicitors',
    organisationIdentifier: 'HAUN33E',
    contactInformation: [
      {
        addressLine1: '23',
        addressLine2: null,
        addressLine3: null,
        townCity: 'Aldgate East',
        county: 'London',
        country: null,
        postCode: 'AT54RT',
        dxAddress: [Array]
      }
    ],
    status: 'ACTIVE',
    sraId: 'SRA1298455554',
    sraRegulated: false,
    superUser: {
      firstName: 'Luke',
      lastName: 'Wilson',
      email: 'lukesuperuserxui@mailnesia.com'
    },
    paymentAccount: []
  };

  beforeEach(() => {

    pipeSpy = spyOn(storeMock, 'pipe').and.returnValue(of(mockOrganisationDetails));
    dispatchSpy = spyOn(storeMock, 'dispatch');

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromStore.reducers),
        }),
      ],
      declarations: [ OrganisationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: storeMock,
        },
        OrganisationComponent
      ]
    }).compileComponents();

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(OrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get the first Contact Information item from the Organisation Details.', () => {

    expect(component.getContactInformation(mockOrganisationDetails)).toEqual(mockOrganisationDetails.contactInformation[0]);
  });

  describe('getDxAddress', () => {

    it('should return null if there is no dxAddress.', () => {

      const contactInformation = {
        addressLine1: '23',
        postCode: 'AT54RT',
      };

      expect(component.getDxAddress(contactInformation)).toBeNull();
    });

    it('should return null if the length of dxAddresses is 0.', () => {

      const contactInformation = {
        addressLine1: '23',
        postCode: 'AT54RT',
        dxAddress: []
      };

      expect(component.getDxAddress(contactInformation)).toBeNull();
    });

    it('should return dxAddress.', () => {

      const dxAddress = {
        dxNumber: 'DX 4534234552',
        dxExchange: 'London',
      };

      const contactInformation = {
        addressLine1: '23',
        postCode: 'AT54RT',
        dxAddress: [
          {
            dxNumber: 'DX 4534234552',
            dxExchange: 'London',
          }
        ]
      };

      expect(component.getDxAddress(contactInformation)).toEqual({
        dxNumber: 'DX 4534234552',
        dxExchange: 'London',
      });
    });
  });

  it('should get the Organisation Details from the Store, and set it on orgData.', () => {

    component.getOrganisationDetailsFromStore();

    expect(store.pipe).toHaveBeenCalled();
    expect(component.getOrganisationDetails()).toEqual(mockOrganisationDetails);
  });
});
