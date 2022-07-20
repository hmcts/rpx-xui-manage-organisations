import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Organisation } from '../../../organisation/organisation.model';
import * as fromStore from '../../../organisation/store';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.scss']
})
export class AccountOverviewComponent implements OnInit {
  public orgData: Organisation;
  public organisationSubscription: Subscription;

  constructor(private readonly store: Store<fromStore.OrganisationState>) {}

  public ngOnInit(): void {
    this.organisationSubscription = this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(( data) => {
      this.orgData = data;
    });
  }

}
