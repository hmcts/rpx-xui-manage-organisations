import { Component, OnInit} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAuth from '../../../auth/store';
@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user$: Observable<fromAuth.AuthState>;
  userPermissions$: Observable<string>;

  constructor(private store: Store<fromAuth.AuthState>) {}

  ngOnInit(): void {
   this.user$ = this.store.pipe(select(fromAuth.getAuthState));
   this.userPermissions$ = this.store.pipe(select(fromAuth.userPermission));
  }
}







