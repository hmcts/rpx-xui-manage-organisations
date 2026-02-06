import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { OrganisationDetails } from '../../../models/organisation.model';
import * as fromStore from '../../../organisation/store';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.scss'],
  standalone: false
})
export class AccountOverviewComponent implements OnInit, OnDestroy {
  public orgData: OrganisationDetails;
  public organisationSubscription: Subscription;

  constructor(private readonly store: Store<fromStore.OrganisationState>) {}

  public ngOnInit(): void {
    this.organisationSubscription = this.store
      .pipe(select(fromStore.getOrganisationSel))
      .subscribe((data: OrganisationDetails) => {
        this.orgData = data;
      }
      );
  }

  public ngOnDestroy(): void {
    if (this.organisationSubscription) {
      this.organisationSubscription.unsubscribe();
    }
  }
}
