import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromFeeAccountSummaryStore from '../../../fee-accounts/store';

/**
 * Bootstraps the Fee Summary Components
 */

@Component({
  selector: 'app-prd-summary-component',
  templateUrl: './summary.component.html',
})
export class SummaryComponent implements OnInit {

  id: string;
  navItems: Array<{}>;

  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<fromFeeAccountSummaryStore.FeeAccountsState>
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.store.dispatch(new fromFeeAccountSummaryStore.LoadFeeAccountSummary({id: this.id}));
      }
    });

    this.navItems = [
      {
        text: 'Summary',
        href: `../../summary/${this.id}`,
        active: true
      },
      {
        text: 'Transactions',
        href: `../../transactions/${this.id}`,
        active: false
      }
    ];

    this.store.pipe(select(fromFeeAccountSummaryStore.getFeeAccountSummaryArray)).subscribe(feeAccountSummaryData => {
      console.log(feeAccountSummaryData);
    });
  }

}
