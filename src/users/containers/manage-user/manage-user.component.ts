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
import { AppConstants } from '../../../app/app.constants';
import { GlobalError } from '../../../app/store/reducers/app.reducer';
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
  public resendInvite: boolean = false;

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

    if (!this.userId){
      console.log('setting up invite subscriptions.');
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_400), takeUntil(this.onDestory$)).subscribe(() => {
        this.handleError(this.userStore, 400);
        console.log('1');
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_404), takeUntil(this.onDestory$)).subscribe(() => {
        this.handleError(this.userStore, 404);
        console.log('2');
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_500), takeUntil(this.onDestory$)).subscribe(() => {
        this.handleError(this.userStore, 500);
        console.log('3');
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_429), takeUntil(this.onDestory$)).subscribe(() => {
      // this.showWarningMessage = true;
        console.log('4');
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_409), takeUntil(this.onDestory$)).subscribe(() => {
      // this.showWarningMessage = true;
        console.log('5');
      });
      this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL), takeUntil(this.onDestory$)).subscribe(() => {
        this.routerStore.dispatch(new fromRoot.Go({ path: ['service-down'] }));
      });
    }
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

    if (this.userId) {
      this.updateUser();
    } else {
      this.inviteUser();
    }
  }

  private inviteUser(): void {
    let value:any = {
      ...this.updatedUser
    };
    if (value.roles.includes('pui-case-manager')) {
      value.roles = [...value.roles, ...AppConstants.CCD_ROLES];
    }
    value = {
      ...value,
      resendInvite: this.resendInvite
    };
    console.log(value);
    this.userStore.dispatch(new fromStore.SendInviteUser(value));
  }

  private updateUser() {
    // TODO: implement
  }

  private getBackurl(userId: string): string {
    return !!userId ? `/users/user/${userId}` : '/users';
  }

  public handleError(store: Store<any>, errorNumber: number): void {
    console.log('handling error' + errorNumber);
    const globalError = this.getGlobalError(errorNumber);
    if (globalError) {
      store.dispatch(new fromRoot.AddGlobalError(globalError));
      store.dispatch(new fromRoot.Go({ path: ['service-down'] }));
    }
  }

  public getGlobalError(error: number): GlobalError {
    console.log(error);
    const errorMessages = this.getErrorMessages(error);
    const globalError = {
      header: this.getErrorHeader(error),
      errors: errorMessages
    };
    return globalError;
  }

  private getErrorMessages(error: number) {
    switch (error) {
      case 400:
        return [{
          bodyText: 'to check the status of the user',
          urlText: 'Refresh and go back',
          url: '/users'
        }];
      case 404:
        return [{
          bodyText: 'to reactivate this account',
          urlText: 'Get help',
          url: '/get-help',
          newTab: true
        }, {
          bodyText: null,
          urlText: 'Go back to manage users',
          url: '/users'
        }];
      case 500:
      default:
        return [{
          bodyText: 'Try again later.',
          urlText: null,
          url: null
        }, {
          bodyText: null,
          urlText: 'Go back to manage users',
          url: '/users'
        }];
    }
  }

  private getErrorHeader(error: number): string {
    switch (error) {
      case 400:
        return 'Sorry, there is a problem';
      case 404:
        return 'Sorry, there is a problem with this account';
      case 500:
      default:
        return 'Sorry, there is a problem with the service';
    }
  }
}
