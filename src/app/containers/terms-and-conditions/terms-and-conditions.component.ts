import { Component } from '@angular/core';
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
export class TermsAndConditionsComponent {

    public document: Observable<TCDocument>;

    constructor(private readonly store: Store<fromRoot.State>) {
        this.document = this.store.pipe(
            select(fromRoot.getTermsAndConditions),
            tap(doc => {
                console.info(doc);
                if (!doc) {
                    this.store.dispatch(new LoadTermsConditions());
                }
            })
        );
    }
}
