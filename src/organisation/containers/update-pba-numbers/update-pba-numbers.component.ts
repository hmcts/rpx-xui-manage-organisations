import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { OrganisationDetails } from '../../../models';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-update-pba-numbers-component',
  templateUrl: './update-pba-numbers.component.html',
})
export class UpdatePbaNumbersComponent implements OnInit {

  public organisationDetails: OrganisationDetails;

  constructor(private readonly orgStore: Store<fromStore.OrganisationState>) { }

  public ngOnInit(): void {
    this.getOrganisationDetailsFromStore();
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisationDetails = organisationDetails;
    });
  }
}
