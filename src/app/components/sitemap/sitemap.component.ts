import { Component } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, shareReplay, take, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../store';
import * as fromAuthStore from '../../../user-profile/store';
import { AuthService } from '../../../user-profile/services/auth.service';
import sitemapSections from './sitemap-links.json';

export interface SitemapLink {
  text: string;
  href: string;
  requiredRole?: string;
  requiredFeature?: string;
}

export interface SitemapSection {
  heading: string;
  links: SitemapLink[];
}

export const SITEMAP_SECTIONS: SitemapSection[] = sitemapSections;

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  standalone: false
})
export class SitemapComponent {
  public readonly sections$: Observable<SitemapSection[]>;
  private readonly isAuthenticated$: Observable<boolean>;

  constructor(
    private readonly store: Store<fromRoot.State>,
    private readonly authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated().pipe(
      catchError(() => of(false)),
      tap((isAuthenticated) => {
        if (isAuthenticated) {
          this.loadUserDetailsIfRequired();
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.sections$ = combineLatest({
      isAuthenticated: this.isAuthenticated$,
      user: this.store.pipe(select(fromAuthStore.getUser)),
      featureFlags: this.store.pipe(select(fromRoot.getFeatureFlag))
    }).pipe(
      map(({ isAuthenticated, user, featureFlags }) => {
        const roles = user?.roles ?? [];
        const enabledFeatures = new Set(
          (featureFlags ?? []).filter((feature) => feature.isEnabled).map((feature) => feature.featureName)
        );
        return SITEMAP_SECTIONS
          .map((section) => ({
            ...section,
            links: section.links.filter((link) => {
              if (!link.requiredRole && !link.requiredFeature) {
                return true;
              }

              return isAuthenticated &&
                (!link.requiredRole || roles.includes(link.requiredRole)) &&
                (!link.requiredFeature || enabledFeatures.has(link.requiredFeature));
            })
          }))
          .filter((section) => section.links.length > 0);
      })
    );
  }

  private loadUserDetailsIfRequired(): void {
    this.store.pipe(select(fromAuthStore.userLoaded), take(1)).subscribe((loaded) => {
      if (!loaded) {
        this.store.dispatch(new fromAuthStore.GetUserDetails());
      }
    });
  }
}
