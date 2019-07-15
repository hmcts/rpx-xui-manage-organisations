import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import {Observable} from 'rxjs';
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';
import {UserListApiModel} from '../../models/userform.model';

@Component({
  selector: 'app-prd-users-component',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  columnConfig: GovukTableColumnConfig[];
  tableUsersData$: Observable<any>; // TODO add type
  isLoading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.UserState>
  ) { }

  ngOnInit(): void {
    this.columnConfig = [
      { header: 'First Name', key: 'firstName' },
      { header: 'Last Name', key: 'lastName' },
      { header: 'Email', key: 'email' },
      { header: 'Status', key: 'status' },
      { header: 'Roles', key: 'roles' }
    ];

    this.store.dispatch(new fromStore.LoadUsers());
    this.tableUsersData$ = this.store.pipe(select(fromStore.getGetUserList));
    this.isLoading$ = this.store.pipe(select(fromStore.getGetUserLoading));
  }

}

