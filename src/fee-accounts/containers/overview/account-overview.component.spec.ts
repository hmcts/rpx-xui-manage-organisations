import { OrganisationAccountsComponent } from './account-overview.component';
import { Subject, of } from 'rxjs';
import * as fromAccountStore from '../../../fee-accounts/store';
import * as fromOrgStore from '../../../organisation/store';
import * as fromRoot from '../../../app/store';
import { OrganisationDetails } from '../../../models/organisation.model';

describe('OrganisationAccountsComponent', () => {
  let component: OrganisationAccountsComponent;
  let feeStore: jasmine.SpyObj<any>;
  let organisationStore: jasmine.SpyObj<any>;
  let actions$: Subject<any>;
  let routerStore: jasmine.SpyObj<any>;

  const organisation = {
    paymentAccount: [
      { pbaNumber: 'PBA1234567' },
      { pbaNumber: 'PBA7654321' }
    ]
  } as OrganisationDetails;

  beforeEach(() => {
    feeStore = jasmine.createSpyObj('feeStore', ['pipe', 'dispatch']);
    organisationStore = jasmine.createSpyObj('organisationStore', ['pipe', 'dispatch']);
    actions$ = new Subject<any>();
    routerStore = jasmine.createSpyObj('routerStore', ['pipe', 'dispatch']);
    component = new OrganisationAccountsComponent(feeStore, organisationStore, actions$ as any, routerStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise account streams and load payment accounts', () => {
    feeStore.pipe.and.returnValues(of([]), of(false), of([]), of(false));
    organisationStore.pipe.and.returnValues(of(false), of(organisation));

    component.ngOnInit();

    expect(organisationStore.dispatch).toHaveBeenCalledWith(new fromOrgStore.LoadOrganisation());
    expect(feeStore.dispatch).toHaveBeenCalledWith(new fromAccountStore.LoadFeeAccounts(['PBA1234567', 'PBA7654321']));
    expect(component.orgData).toEqual(organisation);
    expect(component.columnConfig).toEqual([
      { header: 'Account number', key: 'account_number', type: 'link' },
      { header: 'Account name', key: 'account_name' }
    ]);
  });

  it('should route to service down when fee accounts fail to load', () => {
    feeStore.pipe.and.returnValues(of([]), of(false), of([]), of(false));
    organisationStore.pipe.and.returnValues(of(true), of(organisation));
    component.ngOnInit();

    actions$.next(new fromAccountStore.LoadFeeAccountsFail({}));

    expect(routerStore.dispatch).toHaveBeenCalledWith(new fromRoot.Go({ path: ['service-down'] }));
  });

  it('should dispatch empty success when an organisation has no payment accounts', () => {
    const hasAccount = component.dispatchLoadFeeAccount({
      paymentAccount: []
    } as OrganisationDetails);

    expect(hasAccount).toBeFalse();
    expect(feeStore.dispatch).toHaveBeenCalledWith(new fromAccountStore.LoadFeeAccountsSuccess([]));
  });

  it('should unsubscribe and reset state on destroy', () => {
    component.organisationSubscription = jasmine.createSpyObj('organisationSubscription', ['unsubscribe']);
    component.dependanciesSubscription = jasmine.createSpyObj('dependanciesSubscription', ['unsubscribe']);

    component.ngOnDestroy();

    expect(component.organisationSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.dependanciesSubscription.unsubscribe).toHaveBeenCalled();
    expect(feeStore.dispatch).toHaveBeenCalledWith(new fromAccountStore.LoadFeeAccountResetState());
  });
});
