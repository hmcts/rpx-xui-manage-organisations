import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../store';
import { Observable, Subscription } from 'rxjs';
import { debug } from 'util';
import { Organisation } from 'src/organisation/organisation.model';
import {Router} from '@angular/router';


@Component({
  selector: 'app-prd-organisation-component',
  templateUrl: './organisation.component.html',
})
export class OrganisationComponent implements OnInit, OnDestroy {

  orgData: Organisation[];
  organisationSubscription: Subscription;

  constructor(
    private router: Router,
    private store: Store<fromStore.OrganisationState>,
    private http: HttpClient,
  ) { }


  ngOnInit(): void {
    this.organisationSubscription = this.store.pipe(select(fromStore.getOrganisationSelArr)).subscribe(( data) => {
      this.orgData = data;
    });
  }

  ngOnDestroy() {
    this.organisationSubscription.unsubscribe();
  }

  userDetailsHandler() {
    this.getApi(`/api/user/details`).subscribe(data => {
      console.log(data);
    });
  }

  simpleJsonReturnHandler() {
    this.getApi(`/api/user/simple`).subscribe(data => {
      console.log(data);
    });
  }

  healthHandler() {
    this.getApi(`/api/health`).subscribe(data => {
      console.log(data);
    });
  }

  getApi(url): Observable<any> {
    return this.http.get<any>(url);
  }
}
