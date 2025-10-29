import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as organisationStore from '../../../organisation/store';
import { OrganisationDetails } from 'src/models/organisation.model';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CaaCasesPageType } from '../../models/caa-cases.enum';

@Component({
  selector: 'app-exui-case-accept',
  templateUrl: './accept-cases.component.html',
  styleUrls: ['./accept-cases.component.scss'],
  standalone: false
})
export class AcceptCasesComponent implements OnInit {
  public permissionsForm: any;
  public selectedOrganisation$: Observable<OrganisationDetails>;
  public pageTitle: string;
  public caseType: string;
  private readonly caseShare = '/cases/case-share';
  private readonly caseShareConfirmUrl = '/cases/case-share-confirm/new-cases';

  constructor(
        private readonly organisationStore: Store<organisationStore.OrganisationState>,
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder,
        private readonly router: Router){
  }

  public ngOnInit(): void {
    // Load selected organisation details from store
    this.organisationStore.dispatch(new organisationStore.LoadOrganisation());
    this.selectedOrganisation$ = this.organisationStore.pipe(select(organisationStore.getOrganisationSel));
    this.caseType = this.route.snapshot.queryParams.caseTypeId;
    const newCaseSessionStorage = sessionStorage.getItem('newCases');
    if (newCaseSessionStorage) {
      const newCases = JSON.parse(newCaseSessionStorage);
      this.caseType = newCases.caseTypeId;
    }
    this.pageTitle = `Accept ${this.caseType} cases`;
    this.permissionsForm = this.fb.group({
      assignmentType: ['notAssigning']
    });
  }

  public continue(){
    const newCaseOptions = {
      caseTypeId: this.caseType,
      caaPageType: CaaCasesPageType.NewCases,
      assignCases: this.permissionsForm.value.assignmentType === 'assigning' ? 'assigning' : 'notAssigning'
    };
    sessionStorage.setItem('newCases', JSON.stringify(newCaseOptions));
    if (this.permissionsForm.value.assignmentType === 'assigning'){
      const queryParams = { init: true, pageType: 'unassigned-cases', caseAccept: true };
      this.router.navigate([this.caseShare], { queryParams });
    } else {
      const queryParams = { caseAccept: true, pageType: CaaCasesPageType.NewCases };
      this.router.navigate([this.caseShareConfirmUrl], { queryParams });
    }
  }

  public goBack(){
    this.router.navigate(['/cases']);
  }
}
