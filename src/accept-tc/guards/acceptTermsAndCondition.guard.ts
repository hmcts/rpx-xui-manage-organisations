import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import * as fromRoot from '../../app/store';
import * as fromUserProfile from '../../user-profile/store';

@Injectable()
export class AcceptTermsAndConditionGuard {
  constructor(
    private readonly store: Store<fromRoot.State>
  ) { }

  public canActivate(): Observable<boolean> {
    return of(true);
  }

  public checkStore() {
    return this.store.pipe(select(fromUserProfile.getHasUserSelectedTC),
      tap({
        next: (tcConfirmed) => {
          if (!tcConfirmed.loaded) {
            this.store.pipe(select(fromUserProfile.getUid), take(2)).subscribe((uid) => {
              if (uid) {
                this.store.dispatch(new fromUserProfile.LoadHasAcceptedTC(uid));
              }
            });
          }
          if (tcConfirmed.hasUserAccepted === 'true') {
            this.store.dispatch(new fromRoot.Go({ path: ['/home'] }));
          }
        }
      }),
      filter((tcConfirmed) => tcConfirmed.loaded),
      take(1)
    );
  }
}
