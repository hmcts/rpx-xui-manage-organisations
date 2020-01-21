import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { combineReducers, StoreModule, Store } from '@ngrx/store';
import {Logout, reducers, State} from 'src/app/store';
import { HeaderComponent } from '../header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { cold } from 'jasmine-marbles';

import { AppConstants } from '../../app.constants';
import * as fromAuth from '../../../user-profile/store';
import { RouterTestingModule } from '@angular/router/testing';
import {ManageSessionServices, windowToken} from '@hmcts/rpx-xui-common-lib';
import {Keepalive} from '@ng-idle/keepalive';
import {Idle} from '@ng-idle/core';
import {HttpClientModule} from '@angular/common/http';
import {KeepAlive, SetModal, SignedOut} from '../../../user-profile/store';

const mockedServices = { init: () => {}}
const windowMock: Window = { gtag: () => {}} as any;
describe('AppComponent', () => {
  let store: Store<fromAuth.AuthState>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        StoreModule.forRoot(
          {
            ...reducers,
            userProfile: combineReducers(fromAuth.reducer)
          })
      ],
      providers: [
        {
          provide: windowToken,
          useValue: windowMock
        },
        Keepalive,
        ManageSessionServices,
        {
          provide: Idle,
          useValue: mockedServices
        },
      ],
    }).compileComponents();
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);

    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
  }));

  it('should have pageTitle$ Observable the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const expected = cold('a', { a: '' });
    expect(app.pageTitle$).toBeObservable(expected);

  }));


  it('should have appHeaderTitle$ Observable the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const expected = cold('a', { a: undefined });
    expect(app.appHeaderTitle$).toBeObservable(expected);

  }));

  it('should have userNav$ Observable the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const expected = cold('a', { a: [] });
    expect(app.userNav$).toBeObservable(expected);

  }));


  it('should have navItems$ Observable the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    const navItems = [
      {
        text: 'Organisation',
        href: '/organisation',
        active: true
      },
      {
        text: 'Users',
        href: '/users',
        active: false
      }];
    const expected = cold('a', { a: { navItems: [] } });
    expect(app.navItems$).toBeObservable(expected);

  }));

  it('should dispatch a logout action', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onNavigate('sign-out');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new Logout());

  }));

  it('should dispatchSessionAction dispatich setModal ', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.dispatchSessionAction({type: 'modal', countdown: '0', isVisible: true});
    fixture.detectChanges();
    const payload = {
      session : {
        countdown: '0',
        isVisible: true
      }
    };
    expect(store.dispatch).toHaveBeenCalledWith(new SetModal(payload));
  }));

  it('should dispatchSessionAction dispatich keepalive', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.dispatchSessionAction({type: 'keepalive'});
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(new KeepAlive());
  }));

  it('should dispatchSessionAction dispatich singout', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.dispatchSessionAction({type: 'signout'});
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(new SignedOut());
  }));

  it('should dispatch a setmodal action', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.dispatchModal('0', true);
    fixture.detectChanges();
    const payload = {
      session : {
        countdown: '0',
        isVisible: true
      }
    };
    expect(store.dispatch).toHaveBeenCalledWith(new SetModal(payload));
    expect(app.dispatchModal).toBeDefined()

  }));

  it('should dispatch a onStaySigned', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onStaySignedIn();
    fixture.detectChanges();
    const payload = {
      session : {
        isVisible: false
      }
    };
    expect(store.dispatch).toHaveBeenCalledWith(new SetModal(payload));

  }));

  // it('should have modalData$ Observable the app', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   fixture.detectChanges();
  //
  //   const expected = cold('a', { a: { isVisible: false, countdown: '' } });
  //   expect(app.modalData$).toBeObservable(expected);
  //
  // }));

});
