import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromSingleFeeAccountStore from '../../../fee-accounts/store';
import * as fromLogInStore from '../../../login/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  identityBar$: Observable<fromSingleFeeAccountStore.FeeAccountsState[]>;


  constructor(
    private store: Store<fromSingleFeeAccountStore.FeeAccountsState>,


  ) { }

  ngOnInit() {
    this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountArray));

  }
}
