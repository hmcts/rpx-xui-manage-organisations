import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as organisationStore from '../../../organisation/store';
import { OrganisationDetails } from 'src/models/organisation.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-exui-case-share',
  templateUrl: './accept-cases.component.html',
  styleUrls: ['./accept-cases.component.scss']
})
export class AcceptCasesComponent implements OnInit {
  permissionsForm: any;
  public selectedOrganisation$: Observable<OrganisationDetails>;
  pageTitle: any;
  isCaseAccessAdmin: any;

  constructor(
        private readonly organisationStore: Store<organisationStore.OrganisationState>,
        private fb: FormBuilder,){
  }

  public ngOnInit(): void {
    // Load selected organisation details from store
    this.organisationStore.dispatch(new organisationStore.LoadOrganisation());
    this.selectedOrganisation$ = this.organisationStore.pipe(select(organisationStore.getOrganisationSel));
    this.pageTitle = 'Accept <case_type> cases';

    this.permissionsForm = this.fb.nonNullable.group<any>({
      notAssigning: new FormControl<boolean>(false),
      assigning: new FormControl<boolean>(true)
    }, {});
  }
}

