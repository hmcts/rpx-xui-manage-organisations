import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {Observable, Subscription} from 'rxjs';
import {Organisation} from 'src/organisation/organisation.model';

@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html',
})
export class OrganisationComponent implements OnInit, OnDestroy {

  private organisationDetails;
  private organisationSubscription: Subscription;

  constructor(private store: Store<fromStore.OrganisationState>) {
  }

  /**
   * Take First item of Contact Information
   *
   * We take the first item of Contact Information
   * @return {{}}
   *
   * TODO: Test
   */
  public getFirstContactInformation() {
    return {
      addressLine1: '25',
      addressLine2: null,
      addressLine3: null,
      townCity: 'Aldgate East',
      county: 'London',
      country: null,
      postCode: 'AT54RT',
      dxAddress: [
        {
          dxNumber: 'DX 4534234552',
          dxExchange: 'London'
        }
        ]
    };
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the organisation details, we display these on the page.
   */
  public getOrganisationDetailsFromStore(): void {

    this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisationDetails = organisationDetails;
    });
  }

  public getOrganisationDetails() {

    return this.organisationDetails;
  }

  public ngOnInit(): void {

    this.getOrganisationDetailsFromStore();
  }

  public ngOnDestroy(): void {

    // this.organisationSubscription.unsubscribe();
  }
}
