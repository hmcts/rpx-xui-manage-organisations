import { Component, OnDestroy, OnInit } from '@angular/core';
import { User, UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject, Subscription, takeUntil } from 'rxjs';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import * as fromOrgStore from '../../../organisation/store';
import { ActivatedRoute } from '@angular/router';
import { OrganisationAccessType } from 'src/models';

import { userAccessTypesExample } from '../manage-user/temp-data';

@Component({
  selector: 'app-prd-user-details-component',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  public editPermissionRouter: string;
  public user$: Observable<User>;
  public isLoading$: Observable<boolean>;
  public user: any;
  public userAccessTypes: string[] = [];

  private onDestory$ = new Subject<void>();
  public userSubscription: Subscription;
  public suspendUserServerErrorSubscription: Subscription;

  public actionButtons: { name: string, class: string, action: () => void }[] = [];

  public suspendViewFlag: boolean = false;

  public showSuspendView: () => void;
  public hideSuspendView: () => void;

  public suspendSuccessSubscription: Subscription;
  public userId: string;

  constructor(
    private readonly userStore: Store<fromStore.UserState>,
    private readonly routerStore: Store<fromRoot.State>,
    private readonly orgStore: Store<fromOrgStore.OrganisationState>,
    private readonly actions$: Actions,
    private readonly activeRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.user$ = new Observable();

    const organisationAccessTypes$ = this.orgStore.pipe(select(fromOrgStore.getAccessTypes));
    const getEditUserFeatureIsEnabled$ = this.routerStore.pipe(select(fromRoot.getEditUserFeatureIsEnabled));
    const getOgdInviteUserFlowFeatureIsEnabled$ = this.routerStore.pipe(select(fromRoot.getOgdInviteUserFlowFeatureIsEnabled));

    combineLatest([getEditUserFeatureIsEnabled$, getOgdInviteUserFlowFeatureIsEnabled$])
      .pipe(takeUntil(this.onDestory$))
      .subscribe(([isEditUserFeatureEnabled, isOgdInviteUserFlowFeatureEnabled]) => {
        this.editPermissionRouter = '';
        if (isOgdInviteUserFlowFeatureEnabled) {
          this.editPermissionRouter = 'manage';
        } else if (isEditUserFeatureEnabled){
          this.editPermissionRouter = 'editpermission';
        }
      });

    this.setSuspendViewFunctions();

    this.isLoading$ = this.userStore.pipe(select(fromStore.getGetUserLoading));

    this.userId = this.activeRoute.snapshot.params.userId;

    this.userStore.dispatch(new fromStore.LoadUserDetails(this.userId));

    this.user$ = this.userStore.pipe(select(fromStore.getUserDetails));

    combineLatest([organisationAccessTypes$, this.user$, getOgdInviteUserFlowFeatureIsEnabled$])
      .pipe(takeUntil(this.onDestory$))
      .subscribe(([organisationAccessTypes, user, isFeatureEnabled]) => {
        user = { ...user, accessTypes: JSON.parse(userAccessTypesExample) as UserAccessType };
        this.userAccessTypes = [];
        if (isFeatureEnabled) {
          const accessTypes: UserAccessType[] = user?.accessTypes?.filter((x: UserAccessType) => x.enabled) ?? [];
          const orgAccessTypes: OrganisationAccessType[] = organisationAccessTypes.map((x) => x.accessTypes).reduce((acc, x) => acc.concat(x), []);
          for (const ac of accessTypes) {
            const orgAc = orgAccessTypes.find((x) => x.accessTypeId === ac.accessTypeId && x.organisationProfileId === ac.organisationProfileId);
            if (orgAc) {
              this.userAccessTypes.push(orgAc.description);
            }
          }
        }
      });

    this.userSubscription = this.user$.subscribe((user) => this.handleUserSubscription(user, getEditUserFeatureIsEnabled$));

    this.suspendSuccessSubscription = this.actions$.pipe(ofType(fromStore.SUSPEND_USER_SUCCESS)).subscribe(() => {
      this.hideSuspendView();
    });

    this.suspendUserServerErrorSubscription = this.actions$.pipe(ofType(fromStore.SUSPEND_USER_FAIL)).subscribe(() => {
      this.routerStore.dispatch(new fromRoot.Go({ path: ['service-down'] }));
    });
  }

  public ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    if (this.suspendSuccessSubscription) {
      this.suspendSuccessSubscription.unsubscribe();
    }

    if (this.suspendUserServerErrorSubscription) {
      this.suspendUserServerErrorSubscription.unsubscribe();
    }
  }

  public getDependencyObservables(routerStore: Store<fromStore.UserState>, userStore: Store<fromRoot.State>) {
    return combineLatest([
      routerStore.pipe(select(fromRoot.getRouterState)),
      userStore.pipe(select(fromStore.getGetUserLoaded))
    ]);
  }

  public setSuspendViewFunctions(): void {
    this.hideSuspendView = () => this.suspendViewFlag = false;
    this.showSuspendView = () => this.suspendViewFlag = true;
  }

  public handleUserSubscription(user, isFeatureEnabled$: Observable<boolean>): void {
    if (user && user.status) {
      this.user = { ...user, resendInvite: user.status === 'Pending' };
    }

    isFeatureEnabled$.subscribe((isFeatureEnabled) => {
      if (isFeatureEnabled && this.user && this.user.status === 'Active') {
        this.actionButtons = [
          {
            name: 'Suspend account',
            class: 'hmcts-button--secondary',
            action: this.showSuspendView
          }
        ];
      } else {
        this.actionButtons = null;
      }
    });
  }

  public isInactive(status: string, inactiveStatuses: string[] = ['Suspended', 'Pending']): boolean {
    return !inactiveStatuses.includes(status);
  }

  public isSuspended(status: string): boolean {
    return status === 'Suspended';
  }

  public isPending(status: string): boolean {
    return status === 'Pending';
  }

  public isSuspendView() {
    return this.suspendViewFlag;
  }

  public suspendUser(suspendUser: User) {
    this.userStore.dispatch(new fromStore.SuspendUser(suspendUser));
  }

  public reinviteUser(user: User) {
    this.userStore.dispatch(new fromStore.ReinvitePendingUser(user));
  }
}
