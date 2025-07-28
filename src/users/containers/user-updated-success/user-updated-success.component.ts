import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '@hmcts/rpx-xui-common-lib';
import * as userStore from '../../store';

@Component({
  selector: 'app-user-updated-success',
  templateUrl: './user-updated-success.component.html'
})
export class UserUpdatedSuccessComponent implements OnInit, OnDestroy {
  public user$: Observable<User>;
  constructor(private userStore: Store<userStore.UserState>) {
  }

  ngOnInit(): void {
    this.user$ = this.userStore.pipe(select(userStore.getGetSingleUser));
  }

  ngOnDestroy(): void {
    this.userStore.dispatch(new userStore.Reset());
  }
}
