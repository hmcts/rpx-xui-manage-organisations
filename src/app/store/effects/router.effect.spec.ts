import { Location } from '@angular/common';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, hot, initTestScheduler } from 'jasmine-marbles';
import * as RouterActions from '../actions/router.action';
import { RouterEffects } from './router.effect';

describe('Router Effects', () => {
  let actions$;
  let effects: RouterEffects;

  const routerMock = jasmine.createSpyObj('Router', [
    'navigate'
  ]);

  const locationMock = jasmine.createSpyObj('Location', [
    'back',
    'forward'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Location, useValue: locationMock },
        { provide: Router, useValue: routerMock },
        RouterEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(RouterEffects);

    initTestScheduler();
    addMatchers();
  });

  describe('navigate$', () => {
    it('should navigate', waitForAsync(() => {
      const action = new RouterActions.Go({ path: [] });

      actions$ = hot('-a', { a: action });
      effects.navigate$.subscribe(() => {
        expect(routerMock.navigate).toHaveBeenCalled();
      });
    }));
  });

  describe('navigateBack$', () => {
    it('should navigate back', waitForAsync(() => {
      const action = new RouterActions.Back();

      actions$ = hot('-a', { a: action });
      effects.navigateBack$.subscribe(() => {
        expect(locationMock.back).toHaveBeenCalled();
      });
    }));
  });

  describe('navigateForward$', () => {
    it('should navigate forward', waitForAsync(() => {
      const action = new RouterActions.Forward();

      actions$ = hot('-a', { a: action });
      effects.navigateForward$.subscribe(() => {
        expect(locationMock.forward).toHaveBeenCalled();
      });
    }));
  });
});
