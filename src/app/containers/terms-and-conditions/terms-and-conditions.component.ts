import { Component, OnInit, OnDestroy } from '@angular/core';
import { TCDocument } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../store';
import { LoadTermsConditions } from '../../store';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html'
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {

    public document: TCDocument = null;

    private subscriptions: Subscription[] = [];

    constructor(private readonly store: Store<fromRoot.State>) {
    }

    public ngOnInit() {
        const s = this.store.pipe(
            select(fromRoot.getTermsAndConditions)
        ).subscribe(doc => {
            if (doc) {
                this.document = doc;
            } else {
                this.store.dispatch(new LoadTermsConditions());
            }
        });
        this.subscriptions.push(s);
    }

    public ngOnDestroy() {
        this.subscriptions.forEach(s => {
          if (s) {
            s.unsubscribe();
          }
        });
    }
}
