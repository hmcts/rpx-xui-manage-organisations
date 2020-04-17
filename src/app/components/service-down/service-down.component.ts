import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ErrorMessage, GlobalError } from 'src/app/store/reducers/app.reducer';
import * as fromAppStore from '../../../app/store';

@Component({
    selector: 'app-service-down',
    templateUrl: './service-down.component.html'
})
export class ServiceDownComponent implements OnInit, OnDestroy {
    public currentError: GlobalError;
    constructor(private readonly store: Store<fromAppStore.State>) {
    }
    public ngOnDestroy(): void {
        this.store.dispatch(new fromAppStore.ClearGlobalError());
    }
    public ngOnInit(): void {
        this.currentError = {
            errors: [{bodyText: 'Try again later.', urlText: null, url: null, newTab: null}],
            header: 'Sorry, there is a problem with the service'
        };
        this.store.pipe(select(fromAppStore.getCurrentError))
        .subscribe(error => {
            if (error) {
                this.currentError = error;
            }
        });
    }

    public showErrorLinkWithNewTab(newTab?: boolean): string {
        return (newTab !== null && newTab === true) ? '_blank' : '_self';
    }
}
