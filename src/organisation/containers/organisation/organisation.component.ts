import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { Observable, Subscription } from 'rxjs';
import { Organisation } from 'src/organisation/organisation.model';
import {Router} from '@angular/router';


@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html',
})
export class OrganisationComponent implements OnInit, OnDestroy {

  orgData: Organisation;
  organisationSubscription: Subscription;

  constructor(
    private router: Router,
    private store: Store<fromStore.OrganisationState>
  ) { }


  ngOnInit(): void {
    this.organisationSubscription = this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(( data) => {
      this.orgData = data;
    });
  }

  ngOnDestroy() {
    this.organisationSubscription.unsubscribe();
  }

}
