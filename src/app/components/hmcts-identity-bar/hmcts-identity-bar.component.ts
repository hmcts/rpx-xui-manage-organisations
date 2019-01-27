import {Component, Input, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeeAccountSummaryStore from '../../../fee-accounts/store';

@Component({
    selector: 'app-hmcts-identity-bar',
    templateUrl: './hmcts-identity-bar.component.html',
    styleUrls: ['./hmcts-identity-bar.component.scss']
})
export class HmctsIdentityBarComponent implements OnInit {

    value: {};

    constructor(
        private store: Store<fromFeeAccountSummaryStore.FeeAccountsState>
     ) { }

    ngOnInit() {

        this.store.pipe(select(fromFeeAccountSummaryStore.getFeeAccountSummaryArray)).subscribe(feeAccountSummaryData => {
            this.value  = feeAccountSummaryData;
          });
    }

}
