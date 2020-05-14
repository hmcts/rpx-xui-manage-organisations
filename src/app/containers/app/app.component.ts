import { Component, Inject, OnInit } from '@angular/core';
import { FeatureToggleService, FeatureUser, GoogleAnalyticsService, ManageSessionServices } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from 'src/models/environmentConfig.model';
import { HeadersService } from 'src/shared/services/headers.service';
import { UserService } from 'src/user-profile/services/user.service';
import { AppTitlesModel } from '../../models/app-titles.model';
import { UserNavModel } from '../../models/user-nav.model';
import * as fromUserProfile from '../../../user-profile/store';
import * as fromRoot from '../../store';

/**
 * Root Component that bootstrap all application.
 * It holds the state for global components (header and footer)
 * It redirects user to correct landing page based on users permissions.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public pageTitle$: Observable<string>;
  public navItems$: Observable<any> ;
  public appHeaderTitle$: Observable<AppTitlesModel>;
  public userNav$: Observable<UserNavModel>;
  public modalData$: Observable<{isVisible?: boolean; countdown?: string}>;

  constructor(
    private readonly store: Store<fromRoot.State>,
    private readonly googleAnalyticsService: GoogleAnalyticsService,
    @Inject(ENVIRONMENT_CONFIG) private readonly environmentConfig: EnvironmentConfig,
    private readonly userService: UserService,
    private readonly featureService: FeatureToggleService,
    private readonly headersService: HeadersService,
    private readonly idleService: ManageSessionServices,
  ) {}

  public ngOnInit() {
    // TODO when we run FeeAccounts story, this will get uncommented
    // this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountData));

    this.pageTitle$ = this.store.pipe(select(fromRoot.getPageTitle));
    this.navItems$ = this.store.pipe(select(fromRoot.getNavItems));
    this.appHeaderTitle$ = this.store.pipe(select(fromRoot.getHeaderTitle));
    this.userNav$ = this.store.pipe(select(fromRoot.getUserNav));
    this.modalData$ = this.store.pipe(select(fromRoot.getModalSessionData));

    // no need to unsubscribe as app component is always init.
    this.store.pipe(select(fromRoot.getRouterState)).subscribe(rootState => {
      if (rootState) {
        this.store.dispatch(new fromRoot.SetPageTitle(rootState.state.url));
      }
    });
    this.googleAnalyticsService.init(this.environmentConfig.googleAnalyticsKey);

    if (this.headersService.isAuthenticated()) {
      this.userService.getUserDetails().subscribe(user => {
        const featureUser: FeatureUser = {
          key: user.userId,
          custom: {
            roles: user.roles,
            orgId: user.orgId
          }
        };
        this.featureService.initialize(featureUser);
      });
    }

    this.addIdleServiceListener();
    this.addUserProfileListener();
  }

  /**
   * Add Idle Service Listener
   *
   * We listen for idle service events, that alert the application to the User being idle.
   */
  public addIdleServiceListener() {

    this.idleService.appStateChanges().subscribe(event => {
      this.idleServiceEventHandler(event);
    });
  }

  /**
   * Add User Profile Listener
   *
   * We listen for User Profile details. Once the application has these we are able to initialise the idle timer,
   * which display a message to the User if they have been idle for x amount of time.
   *
   * We await the User Profile details as these contain the User's session timeout information.
   *
   * The session timeout information is different per User dependent on their access group.
   *
   * TODO: Instead of getUser call it getUserProfile?
   */
  public addUserProfileListener() {

    this.store.pipe(select(fromUserProfile.getUser)).subscribe(userProfile => {
      if (userProfile) {
        const { idleModalDisplayTime, totalIdleTime } = userProfile.sessionTimeout;

        this.initIdleService(idleModalDisplayTime, totalIdleTime);
      }
    });
  }

  /**
   * Idle Service Event Handler
   *
   * It shouldn't really be the common libs responsibility to tell the application whether to show and hide the modal,
   * the application should show and hide the modal. The common lib, should only throw the Idle events.
   *
   * TODO: Once keep alive is implemented in Open ID connect then keep alive can be removed.
   *
   * @param value - { 'isVisible': false, 'countdown': ''}
   */
  public idleServiceEventHandler(value) {

    const IDLE_EVENT_MODAL = 'modal';
    const IDLE_EVENT_SIGNOUT = 'signout';
    const IDLE_EVENT_KEEPALIVE = 'keepalive';

    switch (value.type) {
      case IDLE_EVENT_MODAL: {
        this.dispatchModal(value.countdown, value.isVisible);
        return;
      }
      case IDLE_EVENT_SIGNOUT: {
        this.dispatchModal(undefined, false);
        this.onNavigate('sign-out');
        return;
      }
      case IDLE_EVENT_KEEPALIVE: {
        // this.store.dispatch(new fromRoot.KeepAlive());
        return;
      }
      default: {
        throw new Error('Invalid Dispatch session');
      }
    }
  }

  public dispatchModal(countdown = '0', isVisible): void {
    const modalConfig: any = {
      session: {
        countdown,
        isVisible
      }
    };
    this.store.dispatch(new fromRoot.SetModal(modalConfig));
  }

  /**
   * Initialise Idle Service
   *
   * Timeout is the time we allow the User to interact with the Modal.
   * Idle is the amount of time we wait, until we should the modal.
   * Not sure what keepAliveInSeconds is.
   *
   * Why minutes over seconds, or milliseconds?
   *
   * i. Easy to see in the configuration how many minutes each User group's modal
   * and timeout lasts.
   * ii. Less zero's mean less human mistakes.
   *
   * totalIdleTime is the total amount of time in minutes that the User is idle for.
   * idleModalDisplayTime is the total amount of time to display the 'continue' to stay signed in modal.
   *
   * Important note: The idleModalDisplayTime IS PART of the totalIdleTime. The idleModalDisplayTime does not get added to the end of
   * the totalIdleTime.
   *
   * TODO: You may need to hook into signout and use the following:
   * this.store.pipe(select(fromRoot.getRouterUrl));
   * const isSignedOut: boolean = routes.indexOf('signed-out') !== -1;
   *
   * TODO: We don't need the keepAliveInSeconds once Open ID connect has been implemented, as this will automatically keep
   * alive on new async requests from the Node layer.
   *
   * @param idleModalDisplayTime - Should reach here in minutes
   * @param totalIdleTime - Should reach here in minutes
   */
  public initIdleService(idleModalDisplayTime, totalIdleTime) {

    console.log('idleModalDisplayTime');
    console.log(idleModalDisplayTime);

    console.log('totalIdleTime');
    console.log(totalIdleTime);

    // TODO: Move to utils a conversion for minutes to seconds, not required, convert timeout lib to use minutes over
    // both seconds and milliseconds.
    const idleModalDisplayTimeInSeconds = idleModalDisplayTime * 60;
    const totalIdleTimeInMilliseconds = (totalIdleTime * 60) * 1000;

    const idleConfig: any = {
      timeout: idleModalDisplayTimeInSeconds, // TODO: This is in seconds not milliseconds, let's call this idleModalDisplayTime let's get it to here in milliseconds
      idleMilliseconds: totalIdleTimeInMilliseconds, // This should be consistent. ie. milliseconds everywhere. 10 seconds usersTotalIdleTime
      idleServiceName: 'idleSession',
      keepAliveInSeconds: 5 * 60 * 60, // 5 hrs
    };

    this.idleService.init(idleConfig);
  }

  public onStaySignedIn() {
    const payload = {
      session : {
        isVisible: false
      }
    };
    this.store.dispatch(new fromRoot.SetModal(payload));
  }

  public onNavigate(event): void {
    if (event === 'sign-out') {
      return this.store.dispatch(new fromRoot.Logout());
    }
  }
}
