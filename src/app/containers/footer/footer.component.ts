import { Component, Inject } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../../models/environmentConfig.model';
import * as fromUserProfile from '../../../user-profile/store';
import { AppConstants } from '../../app.constants';
import * as fromRoot from '../../store';
import { Helper, Navigation } from './footer.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent {
  public helpData: Helper = AppConstants.FOOTER_DATA;
  public navigationData: Navigation = AppConstants.FOOTER_DATA_NAVIGATION;
  public userEmail$: Observable<string | null>;

  constructor(
    store: Store<fromRoot.State>,
    @Inject(ENVIRONMENT_CONFIG) environmentConfig: EnvironmentConfig
  ) {
    const environment = (environmentConfig.environment || '').toLowerCase();
    const isProduction = ['prod', 'production'].includes(environment);
    this.userEmail$ = isProduction ? of(null) : store.pipe(
      select(fromUserProfile.getUser),
      map((user) => user?.email || null)
    );
  }
}
