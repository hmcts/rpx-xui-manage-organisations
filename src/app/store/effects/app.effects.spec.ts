import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromAppEffects from './app.effects';
import { AppEffects } from './app.effects';
import { SetPageTitleErrors } from '../actions/app.actions';
import * as usersActions from '../../../users/store/actions';
import * as appActions from '../../store/actions';
import * as fromUserProfile from '../../../user-profile/store';
import { CookieService } from 'ngx-cookie';
import {AuthGuard} from '../../../user-profile/guards/auth.guard';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../reducers';
import { JurisdictionService } from '../../../users/services/jurisdiction.service';
import { of, throwError } from 'rxjs';

describe('App Effects', () => {
  let actions$;
  let effects: AppEffects;

  const mockJurisdictionService = jasmine.createSpyObj('mockJurisdictionService', ['getJurisdictions']);
  const mockAuthGuard = jasmine.createSpyObj('mockAuthGuard', ['generateLoginUrl']);


  const cookieService = {
    get: key => {
      return cookieService[key];
    },
    set: (key, value) => {
      cookieService[key] = value;
    },
    removeAll: () => { }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          {
            ...reducers
          })
      ],
      providers: [
        fromAppEffects.AppEffects,
        provideMockActions(() => actions$),
        { provide: CookieService, useValue: cookieService },
        { provide: JurisdictionService, useValue: mockJurisdictionService },
        { provide: AuthGuard, useValue: mockAuthGuard }
      ]
    });

    effects = TestBed.get(AppEffects);

  });

  describe('updateTitle$', () => {
    it('should update error headerTitle', () => {
      const action = new usersActions.UpdateErrorMessages({});
      const completion = new SetPageTitleErrors();
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.updateTitle$).toBeObservable(expected);
    });
  });


  describe('setUserRoles$', () => {
    it('should set user roles', () => {
      const payload = {
        email: 'puisuperuser@mailnesia.com',
          orgId: '1',
          roles: [
          'pui-case-manager',
          'pui-user-manager',
          'pui-finance-manager',
          'pui-organisation-manager'
        ],
          userId: '5b9639a7-49a5-4c85-9e17-bf55186c8afa'
      };
      const userRolesPayload = [
        'pui-case-manager',
        'pui-user-manager',
        'pui-finance-manager',
        'pui-organisation-manager'
      ];
      const action = new fromUserProfile.GetUserDetailsSuccess(payload);
      const completion = new appActions.SetUserRoles(userRolesPayload);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.setUserRoles$).toBeObservable(expected);
    });
  });

  describe('loadJuridictions$', () => {
    it('should dispatch success', () => {
      mockJurisdictionService.getJurisdictions.and.returnValue(of([]));
      const action = new appActions.LoadJurisdictions();
      const completion = new appActions.LoadJurisdictionsSuccess([]);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadJuridictions$).toBeObservable(expected);
    });

    it('should dispatch error', () => {
      mockJurisdictionService.getJurisdictions.and.returnValue(throwError(new Error()));
      const action = new appActions.LoadJurisdictions();
      const completion = new appActions.LoadJurisdictionsFail(new Error());
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadJuridictions$).toBeObservable(expected);
    });
  });
});
