import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { Subscription } from 'rxjs';
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';

@Component({
  selector: 'app-prd-users-component',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit, OnDestroy {

  columnConfig: GovukTableColumnConfig[];
  tableRows: {headers: string;  key: string}[];
  userSubscription: Subscription;

  constructor(
    private store: Store<fromStore.UserState>
  ) { }

  ngOnInit(): void {
    this.columnConfig = [
      { header: 'Email address', key: 'email' },
      { header: 'Manage cases', key: 'manageCases' },
      { header: 'Manage organisation', key: 'manageOrganisation' },
      { header: 'Manage users', key: 'manageUsers' },
      { header: 'Manage fee accounts', key: 'manageFeeAcc' },
      { header: 'status', key: 'status' }
    ];

    this.store.dispatch(new fromStore.LoadUsers());
    this.userSubscription = this.store.pipe(select(fromStore.getGetUserArray)).subscribe(userData => {
      this.tableRows = userData;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}

