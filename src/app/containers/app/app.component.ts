import { Component, Inject, OnInit } from '@angular/core';
import { FeatureToggleService, FeatureUser, GoogleAnalyticsService } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EnvironmentConfig, ENVIRONMENT_CONFIG } from 'src/models/environmentConfig.model';
import { HeadersService } from 'src/shared/services/headers.service';
import { UserService } from 'src/user-profile/services/user.service';
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
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public pageTitle$: Observable<string>;
  public navItems$: Observable<any> ;
  public appHeaderTitle$: Observable<AppTitlesModel>;
  public userNav$: Observable<UserNavModel>;


  constructor(
    private readonly store: Store<fromRoot.State>,
    private readonly googleAnalyticsService: GoogleAnalyticsService,
    @Inject(ENVIRONMENT_CONFIG) private readonly environmentConfig: EnvironmentConfig,
    private readonly userService: UserService,
    private readonly featureService: FeatureToggleService,
    private readonly headersService: HeadersService
  ) {}

  public ngOnInit() {
    // TODO when we run FeeAccounts story, this will get uncommented
    // this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountData));

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
  }

  public onNavigate(event): void {
    if (event === 'sign-out') {
      return this.store.dispatch(new fromRoot.Logout());
    }
  }
}
