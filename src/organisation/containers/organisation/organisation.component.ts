import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { Observable, Subscription } from 'rxjs';
import { debug } from 'util';
import { Organisation } from 'src/organisation/organisation.model';




@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html',
})
export class OrganisationComponent implements OnInit, OnDestroy {

  //orgData: Organisation;
  orgAddress: string
  orgName: string
  organisationSubscription: Subscription;

  constructor(
    private store: Store<fromStore.OrganisationState>
  ) { }



  ngOnInit(): void {
    this.store.dispatch(new fromStore.LoadOrganisation());
    this.organisationSubscription = this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(
      data => this.extractOrgDetails(data)
    )
  }



  extractOrgDetails(orgData) {
    console.log(orgData)
    if (orgData) {
      let addressObj = JSON.parse(orgData.addresses[0].address)
      this.orgAddress = addressObj
      this.orgName = orgData.name;
    }
  }


  ngOnDestroy() {
    this.organisationSubscription.unsubscribe();
  }

}
