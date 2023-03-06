import { Location } from '@angular/common';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { addMatchers, cold, hot, initTestScheduler } from 'jasmine-marbles';
import * as RouterActions from '../actions/router.action';
import { RouterEffects } from './router.effect';

describe('Router Effects', () => {
    let actions$;
    let effects: RouterEffects;

    const RouterMock = jasmine.createSpyObj('Router', [
        'navigate',
    ]);

    const LocationMock = jasmine.createSpyObj('Location', [
        'back',
        'forward',
    ]);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Location, useValue: LocationMock },
                { provide: Router, useValue: RouterMock },
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
                expect(RouterMock.navigate).toHaveBeenCalled();
            });
        }));
    });

    describe('navigateBack$', () => {
        it('should navigate back', waitForAsync(() => {
            const action = new RouterActions.Back();

            actions$ = hot('-a', { a: action });
            effects.navigateBack$.subscribe(() => {
                expect(LocationMock.back).toHaveBeenCalled();
            });
        }));
    });

    describe('navigateForward$', () => {
        it('should navigate forward', waitForAsync(() => {
            const action = new RouterActions.Forward();

            actions$ = hot('-a', { a: action });
            effects.navigateForward$.subscribe(() => {
                expect(LocationMock.forward).toHaveBeenCalled();
            });
        }));
    });
});
