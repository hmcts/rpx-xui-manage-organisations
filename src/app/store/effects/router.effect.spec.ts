import { Location } from '@angular/common';
import { ErrorHandler } from '@angular/core';
import { fakeAsync, flushMicrotasks, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, hot, initTestScheduler } from 'jasmine-marbles';
import { Subject } from 'rxjs';
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
    routerMock.navigate.and.returnValue(Promise.resolve(true));
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
    it('should report rejected navigation and continue handling later actions', fakeAsync(() => {
      const error = new Error('Navigation failed');
      const handleError = spyOn(TestBed.inject(ErrorHandler), 'handleError');
      routerMock.navigate.and.returnValues(Promise.reject(error), Promise.resolve(true));
      actions$ = new Subject();
      const subscription = effects.navigate$.subscribe();

      actions$.next(new RouterActions.Go({ path: ['/first'] }));
      flushMicrotasks();
      expect(handleError).toHaveBeenCalledOnceWith(error);

      actions$.next(new RouterActions.Go({ path: ['/second'], query: { page: 2 }, extras: { replaceUrl: true } }));
      flushMicrotasks();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/second'], { queryParams: { page: 2 }, replaceUrl: true });
      expect(routerMock.navigate).toHaveBeenCalledTimes(2);
      subscription.unsubscribe();
    }));

    it('should not report navigation cancelled by a guard as an error', fakeAsync(() => {
      const handleError = spyOn(TestBed.inject(ErrorHandler), 'handleError');
      routerMock.navigate.and.returnValue(Promise.resolve(false));
      actions$ = new Subject();
      const subscription = effects.navigate$.subscribe();

      actions$.next(new RouterActions.Go({ path: ['/guarded'] }));
      flushMicrotasks();

      expect(handleError).not.toHaveBeenCalled();
      subscription.unsubscribe();
    }));

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
