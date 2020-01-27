import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromRoot from '../../store';
import * as fromUser from '../../../user-profile/store';
import {combineLatest, Observable} from 'rxjs';
import {AppTitlesModel} from '../../models/app-titles.model';
import {UserNavModel} from '../../models/user-nav.model';
import * as fromActions from '../../store';
import {GoogleAnalyticsService, ManageSessionServices} from '@hmcts/rpx-xui-common-lib';
import { environment as config } from '../../../environments/environment';
import {filter, first, take} from 'rxjs/operators';
// import {IdleConfigModelfigModel} from '@hmcts/rpx-xui-common-lib/lib/models/idle-config.model';

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

  public identityBar$: Observable<string[]>;
  public modalData$: Observable<{isVisible?: boolean; countdown?: string}>;
  public pageTitle$: Observable<string>;
  public navItems$: Observable<any> ;
  public appHeaderTitle$: Observable<AppTitlesModel>;
  public userNav$: Observable<UserNavModel>;


  constructor(
    private store: Store<fromRoot.State>,
    private googleAnalyticsService: GoogleAnalyticsService,
    private idleService: ManageSessionServices,
  ) {}

  public ngOnInit() {
    // TODO when we run FeeAccounts story, this will get uncommented
    // this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountData));
    this.modalData$ = this.store.pipe(select(fromUser.getModalSessionData));
    this.pageTitle$ = this.store.pipe(select(fromRoot.getPageTitle));
    this.navItems$ = this.store.pipe(select(fromRoot.getNavItems));
    this.appHeaderTitle$ = this.store.pipe(select(fromRoot.getHeaderTitle));
    this.userNav$ = this.store.pipe(select(fromRoot.getUserNav));

    // no need to unsubscribe as app component is always init.
    this.store.pipe(select(fromRoot.getRouterState)).subscribe(rootState => {
      if (rootState) {
        this.store.dispatch(new fromRoot.SetPageTitle(rootState.state.url));
      }
    });
    this.idleStart();
    this.idleService.appStateChanges().subscribe(value => {
      this.dispatchSessionAction(value);
    });
   this.googleAnalyticsService.init(config.googleAnalyticsKey);
  }

  public dispatchSessionAction(value) {
    switch (value.type) {
      case 'modal': {
        this.dispatchModal(value.countdown, value.isVisible);
        return;
      }
      case 'signout': {
        this.dispatchModal(undefined, false);
        this.store.dispatch(new fromUser.SignedOut()); // sing out BE
        return;
      }
      case 'keepalive': {
        this.store.dispatch(new fromUser.KeepAlive());
        return;
      }
    }
  }

  public idleStart() {
    const route$ = this.store.pipe(select(fromRoot.getRouterUrl));
    const userIdleSession$ =  this.store.pipe(select(fromUser.getUserIdleTime));
    const userTimeOut$ =  this.store.pipe(select(fromUser.getUserTimeOut));
    combineLatest([
      route$.pipe(first(value => typeof value === 'string' )),
      userIdleSession$.pipe(filter(value => !isNaN(value)), take(1)),
      userTimeOut$.pipe(filter(value => !isNaN(value)), take(1))
    ]).subscribe(([routes, idleMilliseconds, timeout]) => {
      const isSignedOut: boolean = routes.indexOf('signed-out') !== -1;
      if (timeout && idleMilliseconds && !isSignedOut) {
        const idleConfig: any = { // todo change this any
          timeout,
          idleMilliseconds,
          keepAliveInSeconds: 5 * 60 * 60, // 5 hrs
          idleServiceName: 'idleSession'
        };
        this.idleService.init(idleConfig);
      }
    });
  }

  public dispatchModal(countdown = '0', isVisible): void {
    const modalConfig: any = {
      session: {
        countdown,
        isVisible
      }
    };
    this.store.dispatch(new fromUser.SetModal(modalConfig));
  }

  public onStaySignedIn() {
    const payload = {
      session : {
        isVisible: false
      }
    };
    this.store.dispatch(new fromUser.SetModal(payload));
  }

  public onNavigate(event): void {
    if (event === 'sign-out') {
      return this.store.dispatch(new fromActions.Logout());
    }
  }
}
