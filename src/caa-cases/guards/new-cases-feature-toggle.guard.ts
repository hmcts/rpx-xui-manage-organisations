import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app/store';

@Injectable()
export class NewCaseFeatureToggleGuard implements CanActivate {
  constructor(private readonly appStore: Store<fromRoot.State>) {}

  public canActivate(): Observable<boolean> {
    return this.appStore.pipe(select(fromRoot.getCaaNewCasesMenuItemsFeatureIsEnabled));
  }
}
