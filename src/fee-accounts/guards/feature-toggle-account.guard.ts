import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../../src/app/store';

@Injectable()
export class FeatureToggleAccountGuard  {
  constructor(private readonly appStore: Store<fromRoot.State>) {}

  public canActivate(): Observable<boolean> {
    return this.appStore.pipe(select(fromRoot.getFeeAndPayFeatureIsEnabled));
  }
}
