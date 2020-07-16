import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
@Component({
    selector: 'app-unassigned-cases-component',
    templateUrl: './unassigned-cases.component.html',
  })

export class UnassignedCasesComponent implements OnInit {
    constructor(private store: Store<fromStore.UnassignedCaseState>) {}
    public ngOnInit(): void {
        // this.organisationSubscription = this.store.pipe(select(fromStore.getOrganisationSel)).subscribe(( data) => {
        //     this.orgData = data;
        //   });
    }

}
