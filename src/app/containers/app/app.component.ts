import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService, FeatureToggleService, FeatureUser, GoogleAnalyticsService, ManageSessionServices } from '@hmcts/rpx-xui-common-lib';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppConstants } from '../../../app/app.constants';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../../models/environmentConfig.model';
import { HeadersService } from '../../../shared/services/headers.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { UserService } from '../../../user-profile/services/user.service';
import * as fromUserProfile from '../../../user-profile/store';
import { AppTitlesModel } from '../../models/app-titles.model';
import { UserNavModel } from '../../models/user-nav.model';
import * as fromRoot from '../../store';

/**
 * Root Component that bootstrap all application.
 * It holds the state for global components (header and footer)
 * It redirects user to correct landing page based on users permissions.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  public pageTitle$: Observable<string>;
  public navItems$: Observable<any>;
  public appHeaderTitle$: Observable<AppTitlesModel>;
  public userNav$: Observable<UserNavModel>;
  public modalData$: Observable<{ isVisible?: boolean; countdown?: string }>;

  public featureToggleKey: string;
  public serviceMessageCookie: string;
  public userRoles: string[];
  public mainContentId = 'content';

  private userId: string = null;
  public cookieName;
  public isCookieBannerVisible: boolean = false;
  private cookieBannerEnabledSubscription: Subscription;
  private pageTitleSubscription: Subscription;

  private cookieBannerEnabled: boolean = false;
  constructor(
    private readonly store: Store<fromRoot.State>,
    private readonly googleAnalyticsService: GoogleAnalyticsService,
    @Inject(ENVIRONMENT_CONFIG) private readonly environmentConfig: EnvironmentConfig,
    private readonly userService: UserService,
    private readonly featureService: FeatureToggleService,
    private readonly headersService: HeadersService,
    private readonly idleService: ManageSessionServices,
    private readonly loggerService: LoggerService,
    private readonly cookieService: CookieService,
    private titleService: Title
  ) {}

  public ngOnInit(): void {
    // TODO when we run FeeAccounts story, this will get uncommented
    // this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountData));

    this.pageTitle$ = this.store.pipe(select(fromRoot.getPageTitle));
    this.navItems$ = this.store.pipe(select(fromRoot.getNavItems));
    this.appHeaderTitle$ = this.store.pipe(select(fromRoot.getHeaderTitle));
    this.userNav$ = this.store.pipe(select(fromRoot.getUserNav));
    this.modalData$ = this.store.pipe(select(fromRoot.getModalSessionData));

    this.featureToggleKey = AppConstants.SERVICE_MESSAGES_FEATURE_TOGGLE_KEY;
    this.serviceMessageCookie = AppConstants.SERVICE_MESSAGE_COOKIE;

    // no need to unsubscribe as app component is always init.
    this.store.pipe(select(fromRoot.getRouterState)).subscribe((rootState) => {
      if (rootState) {
        this.store.dispatch(new fromRoot.SetPageTitle(rootState.state.url));
      }
    });

    this.pageTitleSubscription = this.pageTitle$.subscribe((title) => {
      this.titleService.setTitle(title? title : 'Manage organisation');
    });

    if (this.headersService.isAuthenticated()) {
      this.userService.getUserDetails().subscribe((user) => {
        const featureUser: FeatureUser = {
          key: user.userId,
          roles: user.roles,
          orgId: user.orgId
        };
        console.log(user);
        this.setUserAndCheckCookie(user.userId);
        this.userRoles = featureUser.roles;
        this.featureService.initialize(featureUser, this.environmentConfig.launchDarklyClientId);
      });
    } else {
      this.featureService.initialize({ anonymous: true }, this.environmentConfig.launchDarklyClientId);
    }

    this.addIdleServiceListener();
    this.addUserProfileListener();

    this.handleCookieBannerFeatureToggle();
  }

  public ngOnDestroy(): void {
    this.cookieBannerEnabledSubscription?.unsubscribe();
    this.pageTitleSubscription?.unsubscribe();
  }

  public handleCookieBannerFeatureToggle(): void {
    this.cookieBannerEnabledSubscription = this.featureService.isEnabled('mo-cookie-banner-enabled')
      .subscribe((flag) => {
        this.cookieBannerEnabled = flag;
        this.setCookieBannerVisibility();
      });
  }

  public setUserAndCheckCookie(userId) {
    this.userId = userId;
    if (this.userId) { // check if cookie selection has been made *after* user id is available
      this.cookieName = `hmcts-exui-cookies-${this.userId}-mo-accepted`;
      this.setCookieBannerVisibility();
    }
  }

  public notifyAcceptance() {
    this.loggerService.enableCookies();
    this.googleAnalyticsService.init(this.environmentConfig.googleAnalyticsKey);
  }

  public notifyRejection() {
    // AppInsights
    this.cookieService.deleteCookieByPartialMatch('ai_');
    // Google Analytics
    this.cookieService.deleteCookieByPartialMatch('_ga');
    this.cookieService.deleteCookieByPartialMatch('_gid');
    const domainElements = window.location.hostname.split('.');
    for (let i = 0; i < domainElements.length; i++) {
      const domainName = domainElements.slice(i).join('.');
      this.cookieService.deleteCookieByPartialMatch('_ga', '/', domainName);
      this.cookieService.deleteCookieByPartialMatch('_gid', '/', domainName);
      this.cookieService.deleteCookieByPartialMatch('_ga', '/', `.${domainName}`);
      this.cookieService.deleteCookieByPartialMatch('_gid', '/', `.${domainName}`);
    }
    // DynaTrace
    this.cookieService.deleteCookieByPartialMatch('rxVisitor');
  }

  /**
   * Add Idle Service Listener
   *
   * We listen for idle service events, that alert the application to the User being Idle.
   */
  public addIdleServiceListener() {
    this.idleService.appStateChanges().subscribe((event) => {
      this.idleServiceEventHandler(event);
    });
  }

  /**
   * Add User Profile Listener
   *
   * We listen for User Profile details. Once the application has these details we are able to initialise the idle timer,
   * which displays a Session Timeout Modal to the User if they have been idle for x amount of time.
   *
   * The User profile details contain the User's session timeout information.
   *
   * The User's Session Timeout information is different per User and per application.
   *
   * TODO: Remove console.log(userProfile) after testing
   */
  public addUserProfileListener() {
    this.store.pipe(select(fromUserProfile.getUser)).subscribe((userProfile) => {
      if (userProfile) {
        const { idleModalDisplayTime, totalIdleTime } = userProfile.sessionTimeout;

        this.initIdleService(idleModalDisplayTime, totalIdleTime);
      }
    });
  }

  /**
   * Idle Service Event Handler
   *
   * TODO:
   * It shouldn't really be the common libs responsibility to tell the application whether to show and hide the modal,
   * the application should show and hide the modal. The common lib, should only throw the Idle events.
   *
   * @param value - { 'isVisible': false, 'countdown': ''}
   */
  public idleServiceEventHandler(value) {
    const IDLE_EVENT_MODAL = 'modal';
    const IDLE_EVENT_SIGNOUT = 'signout';
    const IDLE_EVENT_KEEP_ALIVE = 'keepalive';

    switch (value.type) {
      case IDLE_EVENT_MODAL: {
        this.dispatchModal(value.countdown, value.isVisible);
        return;
      }
      case IDLE_EVENT_SIGNOUT: {
        this.dispatchModal(undefined, false);
        this.store.dispatch(new fromRoot.IdleUserSignOut());
        return;
      }
      case IDLE_EVENT_KEEP_ALIVE: {
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
   * We initialise the Idle Service which is part of the common lib.
   *
   * Why do we use minutes up to this point over seconds, or milliseconds?
   *
   * i. Easy to see in the configuration how many minutes each User group's modal
   * and session timeout lasts.
   * ii. Less zero's mean less human mistakes.
   * iii. Discussed with BA minutes makes sense.
   *
   * <code>totalIdleTime</code> is the total amount of time in minutes that the User is idle for.
   * The Users total idle time, includes the time in which we show the Session Timeout Modal to the User
   *
   * <code>idleModalDisplayTime</code> is the total amount of time in minutes to display the Session Timeout Modal.
   *
   * Important note: The idleModalDisplayTime IS PART of the totalIdleTime. The idleModalDisplayTime does not get added to the end of
   * the totalIdleTime.
   *
   * TODO: Clean up the common lib session timeout component.
   * Note that `timeout` as specified by the common lib, uses seconds as its unit of time. Whereas `idleMilliseconds`
   * uses milliseconds. This needs to be changed in the common-lib to use minutes as discussed with the BA. But
   * for now we will do the conversion from minutes used up to this point to units required by the common-lib.
   *
   * TODO: keepAliveInSeconds is not required, awaiting Open Id Connect implementation before it's removal
   *
   * @param idleModalDisplayTime - Should reach here in minutes
   * @param totalIdleTime - Should reach here in minutes
   */
  public initIdleService(idleModalDisplayTime, totalIdleTime) {
    const idleModalDisplayTimeInSeconds = idleModalDisplayTime * 60;
    const totalIdleTimeInMilliseconds = (totalIdleTime * 60) * 1000;

    const idleConfig: any = {
      timeout: idleModalDisplayTimeInSeconds,
      idleMilliseconds: totalIdleTimeInMilliseconds,
      idleServiceName: 'idleSession',
      keepAliveInSeconds: 5 * 60 * 60
    };

    this.idleService.init(idleConfig);
  }

  public onStaySignedIn() {
    const payload = {
      session: {
        isVisible: false
      }
    };
    this.store.dispatch(new fromRoot.SetModal(payload));
  }

  public onNavigate(event): void {
    if (event === 'sign-out') {
      // Clear browser session entries
      window.sessionStorage.clear();
      return this.store.dispatch(new fromRoot.Logout());
    }
  }

  // the fragment attribute in Angular is good however it only scrolls to the anchor tag
  // focussing is not currently supported by the Angular RouterModule and fragment hence this workaround
  public onFocusMainContent() {
    const element = document.getElementById(this.mainContentId);
    if (element) {
      element.focus();
    }
  }

  public setCookieBannerVisibility(): void {
    this.isCookieBannerVisible = this.cookieBannerEnabled && !!this.userId;
  }
}
