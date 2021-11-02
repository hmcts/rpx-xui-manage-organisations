import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { Organisation } from 'src/organisation/organisation.model';
import * as OrgActions from 'src/organisation/store/actions/organisation.actions';
import * as fromAccountStore from '../../../fee-accounts/store';
import { OrganisationAccountsComponent } from './account-overview.component';

describe('OrganisationAccountsComponent', () => {
    let component: OrganisationAccountsComponent;
    let mockStore: any;

    let fixture: ComponentFixture<OrganisationAccountsComponent>;let superNgOnDestroy: jasmine.Spy

    const initialState = {
      org: {
        organisation: {
          organisationDetails: new Organisation({
            paymentAccount: [1,2]
          }),
          loaded: false,
          loading: false,
        }
      },
      feeAccounts: {
        feeAccounts:  {
            feeAccounts: [  {
            account_number: '12345',
            account_name: 'account',
            credit_limit: 'limit',
            available_balance: '0',
            status: 'open',
            effective_date: new Date()
          }],
          oneOrMoreAccountMissing: false,
          loaded: false,
          loading: false,
          errorMessages: null
        },
        singleFeeAccount: {
          overview: {
            data: {},
            loaded: false,
            loading: false,
          },
          transactions: {
          data: {},
          loaded: false,
          loading: false,
          }
        }
      }
    };

    beforeEach(async(() => {
       
        mockStore = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
        let actions$ = of (
          [
            OrgActions.LOAD_ORGANISATION, OrgActions.LOAD_ORGANISATION_SUCCESS,
            fromAccountStore.FeeAccountsEffects, fromAccountStore.LOAD_FEE_ACCOUNTS, fromAccountStore.LOAD_FEE_ACCOUNTS_FAIL,
            fromAccountStore.LOAD_FEE_ACCOUNTS_SUCCESS, fromAccountStore.LOAD_FEE_ONE_OR_MORE_ACCOUNTS_FAIL, fromAccountStore.LOAD_FEE_RESET_STATE,

          ])
        TestBed.configureTestingModule({
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          imports: [
            RouterTestingModule,
          ],
          declarations: [OrganisationAccountsComponent],
          providers: [
            provideMockStore({initialState}),
            provideMockActions(() => actions$),
            {
              provide: ActivatedRoute,
              useValue: {
                snapshot: {
                    params: {
                        cid: '1234'
                    },
                }
              }
            }
          ]  
        })
        .compileComponents();
        fixture = TestBed.createComponent(OrganisationAccountsComponent);
        component = fixture.componentInstance;
        superNgOnDestroy = spyOn(OrganisationAccountsComponent.prototype, 'ngOnDestroy');
        spyOn(component, 'dispatchAction');
        spyOn(component, 'dispatchLoadFeeAccount').and.callThrough();
        fixture.detectChanges();
      }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });
    
    it('organisation subscribes with data', (done) => {
      component.org$.subscribe(org => {
        console.log('org', org);
        expect(org).toBeTruthy();
        done();
      });
    });

    it('loading subscribes with data', (done) => {
      component.loading$.subscribe(loading => {
          expect(loading).toBeFalsy();
          done();
      });
    });

    it('accounts subscribes with data', (done) => {
      component.accounts$.subscribe(accounts => {
        console.log('accounts', accounts);
        expect(accounts).toBeTruthy();
        done();
      });
    });

    it('dispatchLoadFeeAccount is called', (done) => {
      expect(component.dispatchLoadFeeAccount).toHaveBeenCalled();
      expect(component.dispatchAction).toHaveBeenCalled();
      done();
    });

    it('dispatchAction is called', (done) => {
      component.ngOnDestroy();
      fixture.whenStable().then(() => {
        expect(superNgOnDestroy).toHaveBeenCalled();
        done();
     });
    });
});
