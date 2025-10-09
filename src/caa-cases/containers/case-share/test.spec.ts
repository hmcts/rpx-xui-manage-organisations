import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterReducerState, RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { skip } from 'rxjs/operators';
import { RouterStateUrl, State, getRouterState, reducers } from './';

class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
  public serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams }
    } = routerState;
    const { params } = route;

    return { url, params, queryParams };
  }
}

@Component({
    template: '',
    standalone: false
})
class ListMockComponent {}

describe('Router Selectors', () => {
  let store: Store<State>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'list/:someId',
            component: ListMockComponent
          }
        ]),
        StoreModule.forRoot({
          routerX: combineReducers(reducers)
        }),
        StoreRouterConnectingModule.forRoot({
          stateKey: 'routerX'
        })
      ],
      declarations: [ListMockComponent],
      providers: [
        {
          provide: RouterStateSerializer,
          useClass: CustomRouterStateSerializer
        }
      ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  describe('getRouterStateUrl', () => {
    it('should retrieve routerState', (done) => {
      const result = {
        routerX: {
          state: {
            url: '/list/123',
            params: { someId: '123' },
            queryParams: {}
          },
          navigationId: 1
        } as RouterReducerState<RouterStateUrl>
      };
      router.navigateByUrl('/list/123');
      store
        .select(getRouterState)
        .pipe(skip(1))
        .subscribe((routerState) => {
          // eslint-disable-next-line dot-notation
          expect(routerState['routerX']).toEqual(result.routerX);
          done();
        });

      // PRINTS
      /**
       *
       * { router:
       *   { state: { url: '/list/123', params: {someId: 123}, queryParams: {} },
       *   navigationId: 1 },
       * auth:
       * { loggedIn: false } }
       *
       */
    });

    // it('should retrieve routerStateUrl', () => {
    //   router.navigateByUrl('/list/123');
    //   store.select(getRouterStateUrl).subscribe(value => console.log(value));

    // PRINTS
    // undefined
    // TypeError: Cannot read property 'state' of undefined

    // Since the state object returned by getRouterState doesn't expose the router chunk directly but an object wrapping router + auth, then of course, state is not present where the selector tries to reach it.
    // });

    // it('should retrieve isSomeIdParamValid', () => {
    //   router.navigateByUrl('/list/123');
    //   store.select(isSomeIdParamValid).subscribe(value => console.log(value));

    // PRINTS
    // undefined
    // TypeError: Cannot read property 'state' of undefined
    // });
  });
});
