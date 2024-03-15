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
import { CaaCasesSessionState, CaaCasesSessionStateValue } from 'src/caa-cases/models/caa-cases.model';
import { CaaCasesFilterType } from 'src/caa-cases/models/caa-cases.enum';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {
  private readonly caaCasesPageType = 'all-cases-filter';

  public selectedOrganisation$: Observable<OrganisationDetails>;
  public selectedOrganisationUsers$: Observable<User[]>;

  public pageTitle = 'Cases';
  public showFilterSection = false;
  public errorMessages: ErrorMessage[] = [];
  public sessionStateValue: CaaCasesSessionStateValue;

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

    // Retrieve session state to check and pre-populate the previous state if any
    this.retrieveSessionState();
  }

  public onSelectedFilter(selectedFilter: SelectedCaseFilter): void {
    console.log('Selected filter:', selectedFilter);
    // todo: update session state (i.e. remove or store)
    if (selectedFilter.filterType === CaaCasesFilterType.None) {
      this.removeSessionState(this.caaCasesPageType);
    } else {
      this.storeSessionState(selectedFilter);
    }

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

  public removeSessionState(key: string): void {
    this.service.removeSessionState(key);
  }

  public retrieveSessionState(): void {
    this.sessionStateValue = this.service.retrieveSessionState(this.caaCasesPageType);
    if (this.sessionStateValue) {
      this.toggleFilterSection();
    }
  }

  public storeSessionState(selectedFilter: SelectedCaseFilter): void {
    const sessionStateToUpdate: CaaCasesSessionState = {
      key: this.caaCasesPageType,
      value: {
        filterType: selectedFilter.filterType,
        caseReferenceNumber: selectedFilter.filterType === CaaCasesFilterType.CaseReferenceNumber ? selectedFilter.filterValue : null,
        assigneeName: selectedFilter.filterType === CaaCasesFilterType.AssigneeName ? selectedFilter.filterValue : null
      }
    };
    this.sessionStateValue = sessionStateToUpdate.value;
    this.service.storeSessionState(sessionStateToUpdate);
  }
}
