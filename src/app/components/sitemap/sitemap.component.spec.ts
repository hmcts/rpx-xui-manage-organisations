import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import * as fromRoot from '../../store';
import * as fromAuthStore from '../../../user-profile/store';
import { AuthService } from '../../../user-profile/services/auth.service';
import { SitemapComponent } from './sitemap.component';

describe('SitemapComponent', () => {
  let component: SitemapComponent;
  let fixture: ComponentFixture<SitemapComponent>;
  let store: MockStore;
  let authService: jasmine.SpyObj<AuthService>;
  let authState$: BehaviorSubject<boolean>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SitemapComponent],
      imports: [RouterTestingModule],
      providers: [
        provideMockStore(),
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated'])
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authState$ = new BehaviorSubject(false);
    authService.isAuthenticated.and.returnValue(authState$.asObservable());
    store.overrideSelector(fromAuthStore.getUser, null);
    store.overrideSelector(fromAuthStore.userLoaded, false);
    store.overrideSelector(fromRoot.getFeatureFlag, []);
    store.refreshState();
    fixture = TestBed.createComponent(SitemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display only public links when the user is not logged in', () => {
    const pageLinks = Array.from<HTMLAnchorElement>(fixture.nativeElement.querySelectorAll('[data-testid="sitemap-link"]'));

    expect(pageLinks.map((link) => link.getAttribute('href'))).toEqual([
      '/accessibility',
      '/cookies',
      '/privacy-policy',
      '/terms-and-conditions',
      '/get-help',
      '/sitemap'
    ]);
  });

  it('should display links allowed by the logged-in user role and feature flags', () => {
    authState$.next(true);
    store.overrideSelector(fromAuthStore.getUser, { roles: ['pui-user-manager'] } as any);
    store.overrideSelector(fromRoot.getFeatureFlag, [
      { featureName: 'ogd-invite-user-flow', isEnabled: true }
    ]);
    store.refreshState();
    fixture.detectChanges();

    const pageLinks = Array.from<HTMLAnchorElement>(fixture.nativeElement.querySelectorAll('[data-testid="sitemap-link"]'));

    expect(pageLinks.map((link) => link.getAttribute('href'))).toContain('/users');
    expect(pageLinks.map((link) => link.getAttribute('href'))).toContain('/users/invite-user');
    expect(pageLinks.map((link) => link.getAttribute('href'))).toContain('/users/manage');
    expect(pageLinks.map((link) => link.getAttribute('href'))).not.toContain('/organisation');
    expect(pageLinks.map((link) => link.getAttribute('href'))).not.toContain('/fee-accounts');
  });
});
