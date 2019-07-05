import { Component, OnInit} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromAuth from '../../store';
@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user$: Observable<fromAuth.AuthState>;

  constructor(private store: Store<fromAuth.AuthState>) {}

  ngOnInit(): void {
   this.user$ = this.store.pipe(select(fromAuth.getAuthState));
  }
}







