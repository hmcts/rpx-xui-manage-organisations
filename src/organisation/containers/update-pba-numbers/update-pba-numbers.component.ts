import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { OrganisationDetails } from '../../../models';
import * as fromStore from '../../store';
import * as organisationActions from '../../store/actions';

@Component({
  selector: 'app-prd-update-pba-numbers-component',
  templateUrl: './update-pba-numbers.component.html',
  standalone: false
})
export class UpdatePbaNumbersComponent implements OnInit {
  public organisationDetails: OrganisationDetails;

  constructor(private readonly orgStore: Store<fromStore.OrganisationState>) {}

  public ngOnInit(): void {
    this.getOrganisationDetailsFromStore();
    this.orgStore.dispatch(new organisationActions.OrganisationUpdatePBAErrorReset(''));
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe((organisationDetails) => {
      this.organisationDetails = organisationDetails;
    });
  }
}
