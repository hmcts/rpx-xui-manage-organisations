import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, combineLatest, takeUntil } from 'rxjs';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import * as fromOrgStore from '../../../organisation/store';
import { User, UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { CaseManagementPermissions } from '../../models/case-management-permissions.model';
import { BasicAccessTypes } from '../../models/basic-access-types.model';
import { PersonalDetails } from '../../models/personal-details.model';

import { jurisdictionsExample, userAccessTypesExample } from './temp-data';
import { Jurisdiction, OrganisationDetails } from 'src/models';
import { LoggerService } from 'src/shared/services/logger.service';
import { StandardUserPermissionsComponent, UserPersonalDetailsComponent } from 'src/users/components';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html'
})
export class ManageUserComponent implements OnInit, OnDestroy {
  @ViewChild('userPersonalDetails')userPersonalDetails: UserPersonalDetailsComponent;
  @ViewChild('standardPermission')standardPermission: StandardUserPermissionsComponent;

  public backUrl: string;
  public userId: string;
  public organisationAccessTypes$: Observable<Jurisdiction[]>;
  public summaryErrors: { isFromValid: boolean; items: { id: string; message: any; }[]; header: string };
  public user: User;

  // TODO: remove this when the GA-62 is complete and replace with selector
  public jurisdictions = JSON.parse(jurisdictionsExample) as Jurisdiction[];
  public organisationProfileIds:string[];

  private user$: Observable<User>;
  private organisation$: Observable<OrganisationDetails>;
  private updatedUser: User;
  private onDestory$ = new Subject<void>();

  constructor(private readonly actions$: Actions,
    private readonly routerStore: Store<fromRoot.State>,
    private readonly userStore: Store<fromStore.UserState>,
    private readonly orgStore: Store<fromOrgStore.OrganisationState>,
    private loggerService: LoggerService) {}

  ngOnInit(): void {
    this.organisationAccessTypes$ = this.orgStore.pipe(select(fromOrgStore.getAccessTypes));
    this.routerStore.pipe(select(fromRoot.getRouterState)).pipe(takeUntil(this.onDestory$)).subscribe((route) => {
      this.userId = route.state.params.userId;
      this.user$ = this.userStore.pipe(select(fromStore.getGetSingleUser));
      this.organisation$ = this.orgStore.pipe(select(fromOrgStore.getOrganisationSel));
      this.backUrl = this.getBackurl(this.userId);
    });

    combineLatest([this.user$, this.organisation$]).pipe(takeUntil(this.onDestory$)).subscribe(([user, organisation]) => {
      // TODO this is temporary until access types are returned by the API. used to test the population of the form
      organisation = { ...organisation, organisationProfileIds: ['SOLICITOR_PROFILE'] };
      if (user){
        user = { ...user, accessTypes: JSON.parse(userAccessTypesExample) as UserAccessType };
        this.user = user;
      }
      this.organisationProfileIds = organisation.organisationProfileIds ?? [];
    });

    this.actions$.pipe(ofType(fromStore.EDIT_USER_SUCCESS)).subscribe(() => {
      this.routerStore.dispatch(new fromRoot.Go({ path: [`users/user/${this.userId}`] }));
    });

    this.actions$.pipe(ofType(fromStore.REFRESH_USER_FAIL)).subscribe(() => {
      this.summaryErrors = {
        isFromValid: false,
        items: [
          {
            id: null,
            message: 'There was a problem refreshing the user. Please wait for the batch process for changes to be made.'
          }
        ],
        header: 'There was a problem' };
    });
  }

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }

  onPersonalDetailsChange($event: PersonalDetails){
    this.updatedUser = { ...this.updatedUser, firstName: $event.firstName, lastName: $event.lastName, email: $event.email };
    this.loggerService.debug('updatedUser', this.updatedUser);
  }

  onSelectedCaseManagamentPermissionsChange($event: CaseManagementPermissions) {
    // when manageCases is true, add add the pui-case-manager roles field to the user else remove it from the roles field
    const caseAdminRole = 'pui-caa';
    if ($event.manageCases){
      this.updatedUser = { ...this.updatedUser, roles: [...this.updatedUser.roles, caseAdminRole] };
    } else {
      this.updatedUser = { ...this.updatedUser, roles: this.updatedUser.roles.filter((role: string) => role !== caseAdminRole) };
    }
    // when manageCases is false then the roles property is an empty array, which will clear all the access types
    this.updatedUser = { ...this.updatedUser, accessTypes: $event.userAccessTypes };
    this.loggerService.debug('updatedUser', this.updatedUser);
  }

  onStandardUserPermissionsChange($event: BasicAccessTypes) {
    const roles: string[] = [];
    if ($event.isPuiUserManager) {
      roles.push('pui-user-manager');
    }
    if ($event.isPuiFinanceManager) {
      roles.push('pui-finance-manager');
    }
    if ($event.isPuiOrganisationManager) {
      roles.push('pui-organisation-manager');
    }
    if ($event.isCaseAccessAdmin) {
      roles.push('pui-case-manager');
    }
    this.updatedUser = { ...this.updatedUser, roles };
    this.loggerService.debug('updatedUser', this.updatedUser);
  }

  onSubmit() {
    this.userPersonalDetails.personalDetailForm.markAllAsTouched();
    this.userPersonalDetails.updateCurrentErrors();
    this.standardPermission.permissionsForm.markAllAsTouched();
    this.standardPermission.updateCurrentErrors();

    const errorItems: {id: string; message: string[];}[] = [];
    Object.keys(this.userPersonalDetails.errors).forEach((key) => {
      if (this.userPersonalDetails.errors[key].length > 0) {
        errorItems.push({ id: key, message: this.userPersonalDetails.errors[key] });
      }
    });
    if (this.standardPermission.errors.basicPermissions.length > 0){
      errorItems.push({ id: 'isCaseAccessAdmin', message: this.standardPermission.errors.basicPermissions });
    }

    this.summaryErrors = {
      isFromValid: this.userPersonalDetails.personalDetailForm.valid && this.standardPermission.permissionsForm.valid,
      items: errorItems,
      header: 'There is a problem'
    };

    if (errorItems.length > 0){
      return;
    }

    if (this.userId) {
      this.updateUser();
    } else {
      this.inviteUser();
    }
  }

  private inviteUser() {
    // TODO: implement
  }

  private updateUser() {
    // TODO: implement
  }

  private getBackurl(userId: string): string {
    return !!userId ? `/users/user/${userId}` : '/users';
  }
}
