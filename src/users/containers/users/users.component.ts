import { Component, OnInit } from '@angular/core';
import { User } from '@hmcts/rpx-xui-common-lib';
import { GovukTableColumnConfig } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/components/gov-uk-table/gov-uk-table.component';
import { select, Store } from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-users-component',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public columnConfig: GovukTableColumnConfig[];
  public tableUsersData$: Observable<User[]>;
  public isLoading$: Observable<boolean>;

  constructor(
    private readonly store: Store<fromStore.UserState>
  ) { }

  public ngOnInit(): void {

    this.store.dispatch(new fromStore.LoadUsers());
    this.tableUsersData$ = this.store.pipe(select(fromStore.getGetUserList));
    this.isLoading$ = this.store.pipe(select(fromStore.getGetUserLoading));
  }

  public inviteNewUser(): void {
    this.store.dispatch(new fromStore.InviteNewUser());
  }

}
