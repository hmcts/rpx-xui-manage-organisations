import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromStore from '../../organisation/store';
import * as fromUserProfile from '../../user-profile/store';

@Injectable()
export class RoleGuard {
  constructor(private readonly store: Store<fromStore.OrganisationState>) {}

  public canActivate(): Observable<boolean> {
    return this.store.pipe(select(fromUserProfile.getIsUserCaaAdmin));
  }
}
