import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
// TODO: The below is an odd way to import.
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import { Observable } from 'rxjs';

import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-users-component',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Output() public paginationEvent = new EventEmitter<number>();
  public columnConfig: GovukTableColumnConfig[];
  public tableUsersData$: Observable<User[]>;
  public isLoading$: Observable<boolean>;
  public pageNumber: number = 0;

  constructor(
    private readonly store: Store<fromStore.UserState>
  ) {}

  public ngOnInit(): void {
    this.loadUsers(this.pageNumber);
  }

  public inviteNewUser(): void {
    this.store.dispatch(new fromStore.InviteNewUser());
  }

  public loadUsers(pageNumber: number) {
    this.store.dispatch(new fromStore.LoadUsers(pageNumber));
    this.tableUsersData$ = this.store.pipe(select(fromStore.getGetUserList));
    this.isLoading$ = this.store.pipe(select(fromStore.getGetUserLoading));
  }

  public pageNext($event) {
    this.loadUsers(++this.pageNumber);
    this.paginationEvent.emit($event);
  }

}
