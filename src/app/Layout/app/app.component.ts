import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromSingleFeeAccountStore from '../../../fee-accounts/store/index';
import * as fromLogInStore from '../../../login/store/index';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  identityBar$: Observable<fromSingleFeeAccountStore.FeeAccountsState[]>;
  //userLoggedIn$: Observable<any>

  constructor(
    private store: Store<fromSingleFeeAccountStore.FeeAccountsState>,
    // private loginStore: Store<fromLogInStore.LoginState>

  ) { }

  ngOnInit() {
    this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountArray));
    // this.userLoggedIn$ = this.loginStore.pipe(select(fromLogInStore.getLoggedInUser));

  }
}
