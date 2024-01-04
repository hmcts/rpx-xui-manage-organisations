import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromRoot from '../../../app/store';
import { DxAddress, OrganisationContactInformation } from '../../../models';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import * as fromOrgStore from '../../../users/store';
import { OrganisationComponent } from './organisation.component';

const storeMock = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  pipe: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {}
};

const authStoreMock = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  pipe: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {}
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let pipeSpy: jasmine.Spy;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let dispatchSpy: jasmine.Spy;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let userIsPuiFinanceManager: boolean;

const lovRefDataServiceMock = jasmine.createSpyObj('LovRefDataService', ['getListOfValues']);
const featureToggleServiceMock = jasmine.createSpyObj('FeatureToggleService', ['getValue']);

describe('OrganisationComponent', () => {
  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;
  let store: Store<fromOrgStore.UserState>;

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

  const mockOrgTypes = [
    {
      category_key: 'OrgType',
      key: 'BARR',
      value_en: 'Barrister'
    },
    {
      category_key: 'OrgType',
      key: 'OTHER',
      value_en: 'Other',
      child_nodes: [{
        key: 'OTHER-HEALTH',
        value_en: 'Medicine'
      },
      {
        key: 'OTHER-LAW',
        value_en: 'Law'
      }]
    }
  ];

  /**
   * Mock organisation data is representative of data returned from the Node layer.
   */
  const mockOrganisationDetails = {
    name: 'Luke Solicitors',
    organisationIdentifier: 'HAUN33E',
    contactInformation: [
      contactInformation
    ],
    status: 'ACTIVE',
    sraId: 'SRA1298455554',
    sraRegulated: false,
    superUser: {
      firstName: 'Luke',
      lastName: 'Wilson',
      email: 'lukesuperuserxui@mailnesia.com'
    },
    paymentAccount: [{ pbaNumber: 'test' }],
    pendingPaymentAccount: undefined,
    pendingAddPaymentAccount: undefined,
    pendingRemovePaymentAccount: undefined
  };

  beforeEach(() => {
    pipeSpy = spyOn(storeMock, 'pipe').and.returnValue(of(mockOrganisationDetails));
    featureToggleServiceMock.getValue.and.returnValue(of(true));
    lovRefDataServiceMock.getListOfValues.and.returnValue(of(mockOrgTypes));

    dispatchSpy = spyOn(storeMock, 'dispatch');

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromOrgStore.reducers)
        })
      ],
      declarations: [OrganisationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: authStoreMock
        },
        {
          provide: Store,
          useValue: storeMock
        },
        {
          provide: LovRefDataService,
          useValue: lovRefDataServiceMock
        },
        {
          provide: FeatureToggleService,
          useValue: featureToggleServiceMock
        },
        OrganisationComponent
      ]
    }).compileComponents();

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(OrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get the Organisation Details from the Store, and set it on orgData.', () => {
    component.getOrganisationDetailsFromStore();

    expect(store.pipe).toHaveBeenCalled();
    expect(component.organisationDetails).toEqual(mockOrganisationDetails);
  });

  it('should get the User Details from the Store, and set it on orgData.', () => {
    component.getOrganisationDetailsFromStore();

    expect(store.pipe).toHaveBeenCalled();
    expect(component.organisationDetails).toEqual(mockOrganisationDetails);
  });

  describe('showChangePbaNumberLink property', () => {
    const CHANGE_LINK = By.css('#change-pba-account-numbers__link');

    it('should show the \'Change\' link when false', () => {
      component.showChangePbaNumberLink = true;
      fixture.detectChanges();

      const changeLink = fixture.debugElement.query(CHANGE_LINK);

      expect(changeLink).toBeTruthy();
    });

    it('should not show the \'Change\' link when false', () => {
      component.showChangePbaNumberLink = false;
      fixture.detectChanges();

      const changeLink = fixture.debugElement.query(CHANGE_LINK);

      expect(changeLink).toBeNull();
    });
  });

  describe('canShowChangePbaNumbersLink()', () => {
    it('should set to true when the user has pui-finance-manager', () => {
      userIsPuiFinanceManager = true;

      component.canShowChangePbaNumbersLink();

      expect(component.showChangePbaNumberLink).toBeTruthy();
    });
  });

  describe('company registration number visibility', () => {
    it('should display company registration number', () => {
      component.companyRegistrationNumber = '12345678';
      fixture.detectChanges();
      const companyRegistrationNumberEl = fixture.debugElement.nativeElement.querySelector('#company-registration-number') as HTMLElement;
      expect(companyRegistrationNumberEl.textContent).toContain('12345678');
    });

    it('should not display company registration number', () => {
      component.companyRegistrationNumber = '';
      fixture.detectChanges();
      const companyRegistrationNumberEl = fixture.debugElement.nativeElement.querySelector('#company-registration-number') as HTMLElement;
      expect(companyRegistrationNumberEl).toBeNull();
    });
  });

  describe('organisation regulators visibility', () => {
    it('should display organisation regulators', () => {
      component.regulators = [
        {
          regulatorType: 'Solicitor Regulation Authority (SRA)',
          organisationRegistrationNumber: '11223344'
        },
        {
          regulatorType: 'Other',
          regulatorName: 'Other regulatory organisation',
          organisationRegistrationNumber: '12341234'
        },
        {
          regulatorType: 'Charted Institute of Legal Executives',
          organisationRegistrationNumber: '43214321'
        }
      ];
      fixture.detectChanges();
      const regulatorsEl = fixture.debugElement.nativeElement.querySelector('#regulators') as HTMLElement;
      expect(regulatorsEl.textContent).toContain('Solicitor Regulation Authority (SRA)');
    });

    it('should not display organisation regulators', () => {
      component.regulators = null;
      fixture.detectChanges();
      const regulatorsEl = fixture.debugElement.nativeElement.querySelector('#regulators') as HTMLElement;
      expect(regulatorsEl).toBeNull();
    });
  });

  describe('organisation type visibility', () => {
    it('should display organisation type', () => {
      component.organisationType = 'BARR';
      fixture.detectChanges();
      component.orgTypeDescription = 'Barrister';
    });

    it('should display other organisation type', () => {
      component.organisationType = 'OTHER-LAW';
      fixture.detectChanges();
      component.orgTypeDescription = 'Law';
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from observables when subscribed', () => {
      component.orgTypeSubscription = new Observable().subscribe();
      const componentOrgTypeSubscriptionUnsubscribeSpy = spyOn(component.orgTypeSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(componentOrgTypeSubscriptionUnsubscribeSpy).toHaveBeenCalled();
    });

    it('should not unsubscribe from observables when not subscribed', () => {
      component.orgTypeSubscription = new Observable().subscribe();
      const componentOrgTypeSubscriptionUnsubscribeSpy = spyOn(component.orgTypeSubscription, 'unsubscribe');
      component.orgTypeSubscription = undefined;
      component.ngOnDestroy();
      expect(componentOrgTypeSubscriptionUnsubscribeSpy).not.toHaveBeenCalled();
    });
  });
});
