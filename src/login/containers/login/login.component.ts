import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

/**
 * Bootstraps the Login Components
 */

@Component({
  selector: 'app-prd-login-component',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  constructor(private store: Store<fromStore.LoginState>) { }

  ngOnInit(): void {

  }


  onSignIn(value) {
    this.store.dispatch(new fromStore.LoginUser(value));
    this.store.pipe(select(fromStore.getLoggedInUser)).subscribe(data => {
    })
  }

}
