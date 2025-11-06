import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromRoot from '../../../app/store';
import { DxAddress, OrganisationContactInformation, OrganisationDetails, PBANumberModel } from '../../../models';
import { PBAService } from '../../services/pba.service';
import * as fromStore from '../../store';
import { UpdatePbaNumbersCheckComponent } from './update-pba-numbers-check.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@Component({
  template: '<div>Nothing to see here. Move along, please.</div>'
})
class MockComponent {}

describe('UpdatePbaNumbersCheckComponent', () => {
  let pbaService: any;
  const storeMock = {
    actionsDispatched: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    pipe: () => {},
    dispatch: (action: fromStore.OrganisationUpdatePBAs) => {
      storeMock.actionsDispatched.push(action);
    }
  };
  const routerMock = {
    navigateCalls: [],
    navigate: (commands: any[], extras: any): Promise<boolean> => {
      routerMock.navigateCalls.push({ commands, extras });
      return Promise.resolve(true);
    }
  };

  let pipeSpy: jasmine.Spy;
  let dispatchSpy: jasmine.Spy;
  let component: UpdatePbaNumbersCheckComponent;
  let fixture: ComponentFixture<UpdatePbaNumbersCheckComponent>;
  let store: Store<fromStore.OrganisationState>;
  let activatedRoute: any;

  const MOCK_DX_ADDRESS: DxAddress = {
    dxNumber: 'DX 4534234552',
    dxExchange: 'London'
  };

  const MOCK_CONTACT_INFORMATION: OrganisationContactInformation = {
    addressLine1: '23',
    addressLine2: '',
    addressLine3: '',
    townCity: 'Aldgate East',
    county: 'London',
    country: '',
    postCode: 'AT54RT',
    dxAddress: [MOCK_DX_ADDRESS]
  };

  const getMockOrganisation = (add: PBANumberModel[], remove: PBANumberModel[]): OrganisationDetails => {
    return {
      name: 'Luke Solicitors',
      organisationIdentifier: 'HAUN33E',
      organisationProfileIds: [
        'SOLICITOR_PROFILE'
      ],
      contactInformation: [MOCK_CONTACT_INFORMATION],
      pendingPaymentAccount: [],
      status: 'ACTIVE',
      sraId: 'SRA1298455554',
      sraRegulated: false,
      superUser: {
        firstName: 'Luke',
        lastName: 'Wilson',
        email: 'lukesuperuserxui@mailnesia.com'
      },
      paymentAccount: [{ pbaNumber: 'test' }],
      pendingAddPaymentAccount: add,
      pendingRemovePaymentAccount: remove
    };
  };

  beforeEach(() => {
    activatedRoute = {
      snapshot: {
        params: of({})
      }
    };
    pipeSpy = spyOn(storeMock, 'pipe');
    dispatchSpy = spyOn(storeMock, 'dispatch').and.callThrough();
    TestBed.configureTestingModule({
      declarations: [UpdatePbaNumbersCheckComponent, MockComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterModule,
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromStore.reducers)
        })],
      providers: [
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: Store,
          useValue: storeMock
        },
        PBAService,
        { provide: ActivatedRoute, useValue: activatedRoute },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(UpdatePbaNumbersCheckComponent);
    component = fixture.componentInstance;
    pbaService = TestBed.inject(PBAService);
  });

  afterEach(() => {
    routerMock.navigateCalls.length = 0;
    storeMock.actionsDispatched.length = 0;
  });

  describe('when there is nothing pending', () => {
    const MOCK_NOTHING_PENDING: OrganisationDetails = getMockOrganisation([], []);

    beforeEach(() => {
      pipeSpy.and.returnValue(of(MOCK_NOTHING_PENDING));
      fixture.detectChanges();
    });

    it('should have retrieved the Organisation Details from the Store on component initialisation', () => {
      expect(store.pipe).toHaveBeenCalled();
      expect(component.organisationDetails).toEqual(MOCK_NOTHING_PENDING);
    });

    it('should navigate away', () => {
      expect(routerMock.navigateCalls.length).toEqual(1);
      expect(routerMock.navigateCalls[0].commands).toEqual(['/organisation/update-pba-numbers']);
    });
  });

  xdescribe('when there is a pending PBA to remove', () => {
    const REMOVE_NUMBER = 'test';
    const MOCK_PENDING_REMOVE: OrganisationDetails = getMockOrganisation([], [{ pbaNumber: REMOVE_NUMBER }]);

    beforeEach(() => {
      pipeSpy.and.returnValue(of(MOCK_PENDING_REMOVE));
      fixture.detectChanges();
    });

    it('should NOT navigate away', () => {
      expect(routerMock.navigateCalls.length).toEqual(0);
    });

    it('should dispatch an appropriate action when submitting', () => {
      component.onSubmitClicked();
    });
  });
});
