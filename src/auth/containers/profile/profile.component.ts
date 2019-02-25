import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAuth from '../../../auth/store';
import * as fromRoot from '../../../app/store';
import {UserModel} from '../../../auth/models/user.model';
import {AuthState} from '../../../auth/store/reducers/auth.reducer';



@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  user$: Observable<AuthState>;
  constructor(private store: Store<fromAuth.AuthState>) {}

  ngOnInit(): void {
   this.user$ = this.store.pipe(select(fromAuth.getAuthState))
  }

  ngOnDestroy() {
  }
}







