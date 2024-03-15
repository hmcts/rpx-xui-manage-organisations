import { Component, OnInit } from '@angular/core';
import { CaaCasesService } from 'src/caa-cases/services';

import * as organisationStore from '../../../organisation/store';
import * as userStore from '../../../users/store';
import * as caaCasesStore from '../../store';
import { Store, select } from '@ngrx/store';
import { OrganisationDetails } from 'src/models/organisation.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorMessage } from 'src/shared/models/error-message.model';
import { User } from '@hmcts/rpx-xui-common-lib';
import { SelectedCaseFilter } from 'src/caa-cases/models/selected-case-filter.model';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {
  public selectedOrganisation$: Observable<OrganisationDetails>;
  public selectedOrganisationUsers$: Observable<User[]>;

  public pageTitle = 'Cases';
  public showFilterSection = false;
  public errorMessages: ErrorMessage[] = [];

  constructor(private readonly caaCasesStore: Store<caaCasesStore.CaaCasesState>,
    private readonly organisationStore: Store<organisationStore.OrganisationState>,
    private readonly userStore: Store<userStore.UserState>,
    private readonly router: Router,
    private readonly service: CaaCasesService) {
  }

  public ngOnInit(): void {
    // Load selected organisation details from store
    this.organisationStore.dispatch(new organisationStore.LoadOrganisation());
    this.selectedOrganisation$ = this.organisationStore.pipe(select(organisationStore.getOrganisationSel));

    // Load users of selected organisation from store
    this.userStore.dispatch(new userStore.LoadAllUsersNoRoleData());
    this.selectedOrganisationUsers$ = this.userStore.pipe(select(userStore.getGetUserList));
  }

  public onSelectedFilter(selectedFilter: SelectedCaseFilter): void {
    console.log('Selected filter:', selectedFilter);
    // todo: update session state (i.e. remove or store)

    // load cases types based on fileter and value
  }

  public onErrorMessages(errorMessages: ErrorMessage[]): void {
    this.errorMessages = errorMessages;
  }

  public toggleFilterSection(): void {
    this.showFilterSection = !this.showFilterSection;
  }

  public isAnyError(): boolean {
    return Array.isArray(this.errorMessages) && this.errorMessages.length > 0;
  }
}
