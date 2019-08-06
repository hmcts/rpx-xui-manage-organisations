import {Component, OnDestroy, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromRoot from '../../store';
import * as fromStore from '../../../user-profile/store';

import {Subscription} from 'rxjs';
/**
 * Component used for redirection based on permissions.
 * Please replace this in future by guards
 */
@Component({
  selector: 'app-redirect',
  template: ``
})
export class RedirectComponent implements OnInit, OnDestroy {
  redirected = false;
  $navigationSubscription: Subscription;

  constructor(
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.store.dispatch(new fromStore.GetUserDetails());
    this.$navigationSubscription = this.store.pipe(select(fromRoot.getNavItems)).subscribe(nav => {
      if (nav && nav.navItems.length && !this.redirected) {
        this.store.dispatch(new fromRoot.Go({path: [nav.navItems[0].href]}));
        this.redirected = true;
      }
    });
  }
  ngOnDestroy(): void {
    this.$navigationSubscription.unsubscribe();
  }
}
