import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAuth from '../../store';

@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
  standalone: false
})
export class ProfileComponent implements OnInit {
  public user$: Observable<fromAuth.AuthState>;

  constructor(private readonly store: Store<fromAuth.AuthState>) {}

  public ngOnInit(): void {
    this.user$ = this.store.pipe(select(fromAuth.getAuthState));
  }
}

