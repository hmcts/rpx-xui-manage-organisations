import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../../models/environmentConfig.model';
import * as fromUserProfile from '../../../user-profile/store';
import { AppConstants } from '../../app.constants';
import * as fromRoot from '../../store';
import { Helper, Navigation } from './footer.model';

const PUBLIC_REGISTRATION_ROUTES = new Set(['register-org', 'register-org-new']);

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent {
  public helpData: Helper = AppConstants.FOOTER_DATA;
  public userEmail$: Observable<string | null>;

  public get navigationData(): Navigation {
    const primarySegments = this.router.parseUrl(this.router.url).root.children.primary?.segments ?? [];
    const isPublicRegistrationJourney = PUBLIC_REGISTRATION_ROUTES.has(primarySegments[0]?.path ?? '');
    const navigation = AppConstants.FOOTER_DATA_NAVIGATION;

    return {
      ...navigation,
      items: navigation.items.filter((item) => !isPublicRegistrationJourney || item.href !== 'sitemap')
    };
  }

  constructor(
    store: Store<fromRoot.State>,
    @Inject(ENVIRONMENT_CONFIG) environmentConfig: EnvironmentConfig,
    private readonly router: Router
  ) {
    const environment = (environmentConfig.environment || '').toLowerCase();
    const isProduction = ['prod', 'production'].includes(environment);
    this.userEmail$ = isProduction ? of(null) : store.pipe(
      select(fromUserProfile.getUser),
      map((user) => user?.email || null)
    );
  }
}
