import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { OrganisationDetails } from '../../../models/organisation.model';
import * as fromStore from '../../../organisation/store/index';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.scss']
})
export class AccountOverviewComponent implements OnInit {
  public orgData: OrganisationDetails;
  public organisationSubscription: Subscription;

  constructor(private store: Store<fromStore.OrganisationState>) { }

  public ngOnInit(): void {
    this.organisationSubscription = this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(( data) => {
      this.orgData = data;
    });
  }

}
