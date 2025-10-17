import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromRoot from '../../store';

/**
 * Component used for redirection based on permissions.
 * Please replace this in future by guards
 */
@Component({
  selector: 'app-redirect',
  template: '',
  standalone: false
})
export class RedirectComponent implements OnInit, OnDestroy {
  public redirected = false;
  public $navigationSubscription: Subscription;

  constructor(private readonly store: Store<fromRoot.State>) {}

  public ngOnInit(): void {
    this.$navigationSubscription = this.store.pipe(select(fromRoot.getNavItems)).subscribe((nav) => {
      if (nav && nav.navItems.length && !this.redirected) {
        this.store.dispatch(new fromRoot.Go({ path: [nav.navItems[0].href] }));
        this.redirected = true;
      }
    });
  }

  public ngOnDestroy(): void {
    this.$navigationSubscription.unsubscribe();
  }
}
