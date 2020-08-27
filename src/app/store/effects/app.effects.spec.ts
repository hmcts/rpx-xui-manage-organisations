import { TestBed } from '@angular/core/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { provideMockActions } from '@ngrx/effects/testing';
import {StoreModule} from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { CookieService } from 'ngx-cookie';
import { of, throwError } from 'rxjs';
import { TermsConditionsService } from 'src/shared/services/termsConditions.service';
import { JurisdictionService } from 'src/users/services/jurisdiction.service';
import { LoggerService } from '../../../shared/services/logger.service';
import {AuthService} from '../../../user-profile/services/auth.service';
import * as fromUserProfile from '../../../user-profile/store';
import * as usersActions from '../../../users/store/actions';
import * as appActions from '../../store/actions';
import { SetPageTitleErrors } from '../actions/app.actions';
import {reducers} from '../reducers';
import * as fromAppEffects from './app.effects';
import {ENVIRONMENT_CONFIG} from '../../../models/environmentConfig.model';

describe('App Effects', () => {
  let actions$;
  let loggerService: LoggerService;

  const mockJurisdictionService = jasmine.createSpyObj('mockJurisdictionService', ['getJurisdictions']);
  const mockTermsService = jasmine.createSpyObj('mockTermsService', ['getTermsConditions']);
  const mockAuthService = jasmine.createSpyObj('mockAuthService', ['signOut']);
  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['trace', 'info', 'debug', 'log', 'warn', 'error', 'fatal']);
  const mockFeatureToggleService = jasmine.createSpyObj('mockFeatureToggleService', ['isEnabled', 'initialised']);
  let effects: fromAppEffects.AppEffects;

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
        { provide: TermsConditionsService, useValue: mockTermsService },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: LoggerService,
          useValue: mockedLoggerService
        },
        {
          provide: FeatureToggleService,
          useValue: mockFeatureToggleService
        },
        {
          provide: ENVIRONMENT_CONFIG,
          useValue: {}
        },
      ]
    });

    effects = TestBed.get(fromAppEffects.AppEffects);
    loggerService = TestBed.get(LoggerService);

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
          sessionTimeout: {
            idleModalDisplayTime: 10,
            pattern: '.',
            totalIdleTime: 50
          },
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
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe('featureToggleConfig', () => {
    it('getObservable', () => {
      const observables = effects.getObservable(['feature1', 'feature2']);
      // mockFeatureToggleService.isEnabled.and.returnValue(of(true));
      expect(mockFeatureToggleService.isEnabled).toHaveBeenCalledWith('feature1');
      expect(mockFeatureToggleService.isEnabled).toHaveBeenCalledWith('feature2');
      expect(observables).toBeTruthy();
      expect(observables.length).toEqual(2);
    });

    it('getFeaturesPayload', () => {
      const resultAction = effects.getFeaturesPayload([false, true], ['feature1', 'feature2']);
      const features = [{isEnabled: false, featureName: 'feature1'}, {isEnabled: true, featureName: 'feature2'}];
      expect(resultAction).toEqual(new appActions.LoadFeatureToggleConfigSuccess(features));
    });
  });
});
