import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
// TODO: The below is an odd way to import.
import { GovukTableColumnConfig } from '../../../../projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import { UsersService } from '../../../users/services';

import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-users-component',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  @Output() public paginationEvent = new EventEmitter<number>();
  public columnConfig: GovukTableColumnConfig[];
  public tableUsersData$: Observable<User[]>;
  public allUsersData$: Observable<any>;
  public isLoading$: Observable<boolean>;
  public currentPageNumber: number = 1;
  public pageTotalSize: number;
  public allUsersList$: Subscription;

  constructor(
    private readonly store: Store<fromStore.UserState>,
    private readonly usersService: UsersService
  ) {}

  public ngOnInit(): void {
    // Call to usersService.getAllUsersList() is required to set pageTotalSize for pagination purposes
    this.allUsersList$ = this.getAllUsers();
    this.loadUsers();
  }

  public inviteNewUser(): void {
    this.store.dispatch(new fromStore.InviteNewUser());
  }

  public loadUsers(): void {
    this.store.dispatch(new fromStore.LoadAllUsersNoRoleData());
    this.tableUsersData$ = this.store.pipe(select(fromStore.getGetUserList));
    this.isLoading$ = this.store.pipe(select(fromStore.getGetUserLoading));
  }

  public getAllUsers(): Subscription {
    return this.usersService.getAllUsersList().subscribe((allUserList) => {
      this.pageTotalSize = allUserList.users.length;
    });
  }

  public pageChange(pageNumber: number): void {
    this.currentPageNumber = pageNumber;
    this.loadUsers();
  }

  public ngOnDestroy(): void {
    this.allUsersList$?.unsubscribe();
  }
}
