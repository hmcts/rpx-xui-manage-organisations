import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { GoogleAnalyticsService, ManageSessionServices } from '@hmcts/rpx-xui-common-lib';
import { Observable } from 'rxjs';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {AppTitlesModel} from '../../models/app-titles.model';
import {UserNavModel} from '../../models/user-nav.model';
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
    private readonly idleService: ManageSessionServices,
    private readonly environmentService: EnvironmentService
  ) {}

  public ngOnInit() {
    console.log('ngOnInit');
    // TODO when we run FeeAccounts story, this will get uncommented
    // this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountData));

    this.pageTitle$ = this.store.pipe(select(fromRoot.getPageTitle));
    this.navItems$ = this.store.pipe(select(fromRoot.getNavItems));
    this.appHeaderTitle$ = this.store.pipe(select(fromRoot.getHeaderTitle));
    this.userNav$ = this.store.pipe(select(fromRoot.getUserNav));

    this.modalData$ = this.store.pipe(select(fromRoot.getModalSessionData));
    this.modalData$.subscribe(modal => {
      console.log('modal');
      console.log(modal);
    });

    // no need to unsubscribe as app component is always init.
    this.store.pipe(select(fromRoot.getRouterState)).subscribe(rootState => {
      if (rootState) {
        this.store.dispatch(new fromRoot.SetPageTitle(rootState.state.url));
      }
    });

    this.environmentService.config$.subscribe( environmentConfig => {
      this.googleAnalyticsService.init(environmentConfig.googleAnalyticsKey);
    });

    this.idleService.appStateChanges().subscribe(value => {
      console.log('appStateChanges');
      console.log(value);
      this.dispatchSessionAction(value);
    });
    this.initIdleService();
  }

  public dispatchSessionAction(value) {
    switch (value.type) {
      case 'modal': {
        console.log(value.countdown);
        console.log(value.isVisible);
        this.dispatchModal(value.countdown, value.isVisible);
        return;
      }
      case 'signout': {
        this.dispatchModal(undefined, false);
        // this.store.dispatch(new fromRoot.SignedOut()); // sing out BE
        return;
      }
      case 'keepalive': {
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
    console.log('modalConfig');
    console.log(modalConfig);
    this.store.dispatch(new fromRoot.SetModal(modalConfig));
  }

  /**
   * Timeout is the time we allow the User to interact with the Modal.
   * Idle is the amount of time we wait, until we should the modal.
   * Not sure what keepAliveInSeconds is.
   */
  public initIdleService() {
    // const route$ = this.store.pipe(select(fromRoot.getRouterUrl));
    // const userIdleSession$ =  this.store.pipe(select(fromRoot.getUserIdleTime));
    // const userTimeOut$ =  this.store.pipe(select(fromRoot.getUserTimeOut));
    // combineLatest([
    //   route$.pipe(first(value => typeof value === 'string' )),
    //   userIdleSession$.pipe(filter(value => !isNaN(value)), take(1)),
    //   userTimeOut$.pipe(filter(value => !isNaN(value)), take(1))
    // ]).subscribe(([routes, idleMilliseconds, timeout]) => {
    //   const isSignedOut: boolean = routes.indexOf('signed-out') !== -1;
    //   if (timeout && idleMilliseconds && !isSignedOut) {

    // TODO: This configuration needs to change dependent on the User.
    const idleConfig: any = { // todo change this any
      timeout: 5, // TODO: This is in seconds not milliseconds
      idleMilliseconds: 30000,
      keepAliveInSeconds: 5 * 60 * 60, // 5 hrs
      idleServiceName: 'idleSession'
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
  };

  public onNavigate(event): void {
    if (event === 'sign-out') {
      return this.store.dispatch(new fromRoot.Logout());
    }
  }
}
