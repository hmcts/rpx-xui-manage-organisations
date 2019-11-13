import { Component, OnInit } from '@angular/core';
import { TCDocument } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fromRoot from '../../store';
import { LoadTermsConditions } from '../../store';

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html'
})
export class TermsAndConditionsComponent implements OnInit {

    public document: TCDocument = null;

    constructor(private readonly store: Store<fromRoot.State>) {
    }

    public ngOnInit() {
        this.store.pipe(
            select(fromRoot.getTermsAndConditions)
        ).subscribe(doc => {
            if (doc) {
                this.document = doc;
            } else {
                this.store.dispatch(new LoadTermsConditions());
            }
        });
    }
}
