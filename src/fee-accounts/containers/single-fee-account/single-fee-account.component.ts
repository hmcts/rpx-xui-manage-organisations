import {Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromSingleFeeAccountStore from '../../store';
import * as fromRouterStore from '../../../app/store';
import { Subscription } from 'rxjs';

/**
 * Bootstraps the Single Fee Account Components
 */

@Component({
  selector: 'app-prd-single-fee-account-component',
  templateUrl: './single-fee-account.component.html',
})
export class SingleFeeAccountComponent implements OnInit, OnDestroy {

  id: string;
  navItems: Array<{}>;
  singleFeeAccountData: {};

  sectionHeader: string;
  activeTab: string;

  routeSubscription: Subscription;
  singleFeeAccountSubscription: Subscription;
  routerSubscription: Subscription;

  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<fromSingleFeeAccountStore.FeeAccountsState>
  ) {}

  ngOnInit(): void {
    this.sectionHeader = 'Summary';
    this.activeTab = 'summary';

    // TODO: get id from route state
    this.routeSubscription = this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.store.dispatch(new fromSingleFeeAccountStore.LoadSingleFeeAccount({id: this.id}));
      }
    });

    this.routerSubscription = this.store.pipe(select(fromRouterStore.getRouterState)).subscribe(routerState => {
      const url = routerState.state.url;
      const pathElementsReverse = url.split('/').reverse();
      const activePath = this.setActivePath(pathElementsReverse[0]);
      this.sectionHeader = activePath.sectionHeader;
      this.activeTab = activePath.activeTab;

      this.navItems = [
        {
          text: 'Summary',
          href: `../../account/${this.id}/summary`,
          active: this.isActiveTab('summary')
        },
        {
          text: 'Transactions',
          href: `../../account/${this.id}/transactions`,
          active: this.isActiveTab('transactions')
        }
      ];
    });


    this.singleFeeAccountSubscription = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountArray))
    .subscribe(feeAccountSingleFeeAccountData => {
      this.singleFeeAccountData  = feeAccountSingleFeeAccountData;
    });
  }

  setActivePath(path: string): { sectionHeader: string, activeTab: string } {
    let retValue = { sectionHeader: 'Summary', activeTab: 'summary' };

    if (path === 'summary') {
      retValue = { sectionHeader: 'Summary', activeTab: 'summary' };
    }

    if (path === 'transactions') {
      retValue = { sectionHeader: 'Transactions', activeTab: 'transactions' };
    }

    return retValue;
  }

  isActiveTab(path: string) {
    return path === this.activeTab;
  }

  ngOnDestroy() {
    this.store.dispatch(new fromSingleFeeAccountStore.ResetSingleFeeAccount({}));
    this.routeSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    this.singleFeeAccountSubscription.unsubscribe();
  }

}
