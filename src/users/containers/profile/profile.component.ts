import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromLogInStore from '../../../login/store';
import { Observable, Subscription } from 'rxjs';
import { debug } from 'util';
import { LoggedUser } from 'src/login/loggedUser.model';




@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit,  OnDestroy {

  userProfile: LoggedUser;
  loginSubscription: Subscription;

  constructor(
    private store: Store<fromLogInStore.LoginState>
  ) { }


  ngOnInit(): void {
    this.loginSubscription = this.store.pipe(select(fromLogInStore.getLoggedInUser)).subscribe(userdata => {
      this.userProfile = userdata;
    });
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}







