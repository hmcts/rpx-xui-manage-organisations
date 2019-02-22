import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debug } from 'util';
import * as fromAuth from '../../../auth/store';
import * as fromRoot from '../../../app/store';



@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {

  loginSubscription: Subscription;

  user$;

  constructor(private store: Store<fromAuth.AuthState>) {}

  ngOnInit(): void {
   this.user$ = this.store.pipe(select(fromAuth.getAuthState))
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}







