import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
// TODO: The below is an odd way to import.
import { GovukTableColumnConfig } from '../../../../projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import { map } from 'rxjs/operators';
import { AppConstants } from 'src/app/app.constants';

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
  public filterValues: string = '';
  public userList: Array<object>;
  public searchFiltersEnabled$: Observable<boolean>;
  public ogdFeatureToggleName: string = AppConstants.FEATURE_NAMES.ogdInviteUserFlow;

  constructor(
    private readonly store: Store<fromStore.UserState>,
    private readonly routerStore: Store<fromRoot.State>,
  ) {}

  public ngOnInit(): void {
    this.loadUsers();
    this.searchFiltersEnabled$ = this.routerStore.pipe(select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled));
  }

  public inviteNewUser(): void {
    this.store.dispatch(new fromStore.InviteNewUser());
  }

  public loadUsers(): void {
    this.store.dispatch(new fromStore.LoadAllUsersNoRoleData());
    this.tableUsersData$ = this.store.pipe(
      select(fromStore.getGetUserList),
      map((users) => {
        this.pageTotalSize = users.length;
        return users;
      })
    );
    this.isLoading$ = this.store.pipe(select(fromStore.getGetUserLoading));
  }

  public handleFilterUpdates(event){
    this.filterValues = event;
    this.tableUsersData$ = this.store.pipe(select(fromStore.getGetUserList));
    this.isLoading$ = this.store.pipe(select(fromStore.getGetUserLoading));
  }

  public pageChange(pageNumber: number): void {
    this.currentPageNumber = pageNumber;
    this.loadUsers();
  }

  public ngOnDestroy(): void {
    this.allUsersList$?.unsubscribe();
  }
}
