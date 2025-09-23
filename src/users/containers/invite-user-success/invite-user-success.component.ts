import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '../../store';

@Component({
    selector: 'app-invite-user-success',
    templateUrl: './invite-user-success.component.html',
    standalone: false
})
export class InviteUserSuccessComponent implements OnInit, OnDestroy {
  public userEmail$: Observable<string>;

  constructor(private readonly store: Store<fromStore.UserState>) {}

  public ngOnInit(): void {
    this.userEmail$ = this.store.pipe(select(fromStore.getInviteUserEmail));
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new fromStore.Reset());
  }
}
