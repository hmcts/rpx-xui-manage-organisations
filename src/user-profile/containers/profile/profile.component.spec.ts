import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserModel } from '../../models/user.model';
import * as fromAuth from '../../store';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let store: MockStore;

  const authState: fromAuth.AuthState = {
    ...fromAuth.initialState,
    loaded: true,
    user: new UserModel({
      firstName: 'Test',
      lastName: 'User',
      emailId: 'test.user@example.com',
      email: 'test.user@example.com',
      roles: ['pui-user-manager'],
      sessionTimeout: {
        idleModalDisplayTime: 10,
        totalIdleTime: 50
      },
      userId: 'user-1'
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [provideMockStore()]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(fromAuth.getAuthState, authState);
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should select the authenticated user state on init', (done) => {
    component.ngOnInit();

    component.user$.subscribe((userState) => {
      expect(userState).toEqual(authState);
      done();
    });
  });

  it('should render profile details when a user is available', () => {
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Profile');
    expect(textContent).toContain('First name');
    expect(textContent).toContain('Test');
    expect(textContent).toContain('Last name');
    expect(textContent).toContain('User');
    expect(textContent).toContain('Email');
    expect(textContent).toContain('test.user@example.com');
  });

  it('should not render the profile table when no user is available', () => {
    store.overrideSelector(fromAuth.getAuthState, {
      ...fromAuth.initialState,
      user: null
    });
    store.refreshState();

    fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });
});
