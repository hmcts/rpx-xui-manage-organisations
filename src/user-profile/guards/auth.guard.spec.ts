import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as fromStore from '../store';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockStore: MockStore;
  let mockService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated', 'loginRedirect']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        provideMockStore(),
        {
          provide: AuthService,
          useValue: mockService
        }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    mockStore = TestBed.inject(MockStore);
    spyOn(mockStore, 'dispatch');
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  describe('canActivate', () => {
    it('is Truthy', () => {
      expect(guard).toBeTruthy();
    });
  });

  it('should allow activation when authenticated and user details are loaded', (done) => {
    mockService.isAuthenticated.and.returnValue(of(true));
    mockStore.overrideSelector(fromStore.userLoaded, true);

    guard.canActivate().subscribe((result) => {
      expect(result).toBeTrue();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to login when the user is not authenticated', (done) => {
    mockService.isAuthenticated.and.returnValue(of(false));

    guard.canActivate().subscribe((result) => {
      expect(result).toBeFalse();
      expect(mockService.loginRedirect).toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to login when authentication errors', (done) => {
    mockService.isAuthenticated.and.returnValue(throwError(() => new Error('auth error')));

    guard.isAuthenticated().subscribe((result) => {
      expect(result).toBeFalse();
      expect(mockService.loginRedirect).toHaveBeenCalled();
      done();
    });
  });

  it('should dispatch user details load when the user state is not loaded', (done) => {
    const userLoadedSelector = mockStore.overrideSelector(fromStore.userLoaded, false);

    guard.checkUserStore().subscribe((loaded) => {
      expect(loaded).toBeTrue();
      expect(mockStore.dispatch).toHaveBeenCalledWith(new fromStore.GetUserDetails());
      done();
    });

    expect(mockStore.dispatch).toHaveBeenCalledWith(new fromStore.GetUserDetails());
    userLoadedSelector.setResult(true);
    mockStore.refreshState();
  });
});
