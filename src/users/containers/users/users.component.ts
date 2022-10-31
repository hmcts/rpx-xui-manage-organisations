import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
// TODO: The below is an odd way to import.
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import { Observable } from 'rxjs';
import { UsersService } from '../../../users/services';

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
  public allUsersData$: Observable<any>;
  public isLoading$: Observable<boolean>;
  public currentPageNumber: number = 1;
  public pageTotalSize: number;

  constructor(
    private readonly store: Store<fromStore.UserState>,
    private usersService: UsersService
  ) {}

  public ngOnInit(): void {
    this.getAllUsers();
    this.loadUsers(this.currentPageNumber - 1 );
  }

  public inviteNewUser(): void {
    this.store.dispatch(new fromStore.InviteNewUser());
  }

  public loadUsers(pageNumber: number) {
    this.store.dispatch(new fromStore.LoadUsers(pageNumber));
    this.tableUsersData$ = this.store.pipe(select(fromStore.getGetUserList));
    this.isLoading$ = this.store.pipe(select(fromStore.getGetUserLoading));
  }

  public getAllUsers() {
    return this.usersService.getAllUsersList().subscribe((allUserList => {
      this.pageTotalSize = allUserList.users.length;
    }));
  }

  public pageChange(pageNumber: number) {
    this.currentPageNumber = pageNumber;
    this.loadUsers(pageNumber - 1);
  }
}
