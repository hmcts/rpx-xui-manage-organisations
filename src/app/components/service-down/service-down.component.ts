import { Component, OnDestroy, OnInit } from '@angular/core';
import { buildCompositeTrackKey } from 'src/shared/utils/track-by.util';
import { select, Store } from '@ngrx/store';

import * as fromAppStore from '../../../app/store';
import { GlobalError } from '../../../app/store/reducers/app.reducer';

@Component({
  selector: 'app-service-down',
  templateUrl: './service-down.component.html',
  standalone: false
})
export class ServiceDownComponent implements OnInit, OnDestroy {
  public currentError: GlobalError;

  constructor(private readonly store: Store<fromAppStore.State>) {}

  public ngOnInit(): void {
    this.currentError = {
      errors: [{ bodyText: 'Try again later.', urlText: null, url: null, newTab: null }],
      header: 'Sorry, there is a problem with the service'
    };
    this.store.pipe(select(fromAppStore.getCurrentError))
      .subscribe((error) => {
        if (error) {
          this.currentError = error;
        }
      });
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new fromAppStore.ClearGlobalError());
  }

  public showErrorLinkWithNewTab(newTab?: boolean): string {
    return (newTab !== null && newTab === true) ? '_blank' : '_self';
  }

  public trackByServiceDownError(index: number, error: { bodyText: string; urlText?: string }): string | number {
    return buildCompositeTrackKey(index, error?.bodyText, error?.urlText);
  }
}
