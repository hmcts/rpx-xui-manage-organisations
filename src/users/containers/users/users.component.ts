import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { Observable } from 'rxjs';
import { debug } from 'util';
import { GovukTableColumnConfig } from 'src/app/components/govuk-table/govuk-table.component';



@Component({
  selector: 'app-prd-users-component',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {

  columnConfig: GovukTableColumnConfig[];
  tableRows: {}[];

  constructor(
    private store: Store<fromStore.UserState>
  ) { }


  ngOnInit(): void {
    this.columnConfig = [
      { header: 'Email address', key: 'email' },
      { header: 'Manage cases', key: 'manageCases' },
      { header: 'Manage organisation', key: 'manageOrganisation' },
      { header: 'Manage users', key: 'submittedBy,manageUsers' },
      { header: 'Manage fee accounts', key: 'manageFeeAcc' },
      { header: 'status', key: 'status' }
    ];


    this.store.dispatch(new fromStore.LoadUsers());
    this.store.pipe(select(fromStore.getGetUserArray)).subscribe(userData => {
      console.log(userData);
      this.tableRows = userData;
    });
  }



  // dispatch load action

  // subscribe to a selector
}

