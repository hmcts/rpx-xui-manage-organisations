import { Component, OnInit } from '@angular/core';
import * as fromStore from '../../../organisation/store/index';
import { Organisation } from 'src/organisation/organisation.model';
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.scss']
})
export class AccountOverviewComponent implements OnInit {
  orgData: Organisation;
  organisationSubscription: Subscription;

  constructor(private store: Store<fromStore.OrganisationState>) { }

  ngOnInit() {
    this.organisationSubscription = this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(( data) => {
      this.orgData = data;
      console.log(this.orgData);
    });
  }

}
