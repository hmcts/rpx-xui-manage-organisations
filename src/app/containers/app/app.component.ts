import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromRoot from '../../store';
import { Observable } from 'rxjs';
import {NavItemsModel} from '../../models/nav-items.model';
import {AppTitlesModel} from '../../models/app-titles.model';
import {UserNavModel} from '../../models/user-nav.model';
import * as fromActions from '../../store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  identityBar$: Observable<string[]>;

  pageTitle$: Observable<string>;
  navItems$: Observable<NavItemsModel[]> ;
  appHeaderTitle$: Observable<AppTitlesModel>;
  userNav$: Observable<UserNavModel>;


  constructor(
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    // this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountData));

    this.pageTitle$ = this.store.pipe(select(fromRoot.getPageTitle));
    this.navItems$ = this.store.pipe(select(fromRoot.getNavItems));
    this.appHeaderTitle$ = this.store.pipe(select(fromRoot.getHeaderTitle));
    this.userNav$ = this.store.pipe(select(fromRoot.getUserNav));

    // no need to unsubscribe as app component is always init.
    this.store.pipe(select(fromRoot.getRouterState)).subscribe(rootState => {
      if (rootState) {
        this.store.dispatch(new fromRoot.SetPageTitle(rootState.state.url));
      }
    });
  }

  onNavigate(event): void {
    if (event === 'sign-out') {
      return this.store.dispatch(new fromActions.Logout());
    }
  }
}
