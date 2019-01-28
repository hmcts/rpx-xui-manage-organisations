import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromFeeAccountSummaryStore from '../../../fee-accounts/store';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  identityBar: Observable<any>;

  constructor(
    private store: Store<fromFeeAccountSummaryStore.FeeAccountsState>
  ) { }

  ngOnInit() {

    this.identityBar = of(this.store.pipe(select(fromFeeAccountSummaryStore.getFeeAccountSummaryArray)));
  }
}
