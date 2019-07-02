import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store/';
import * as fromRoot from '../../../app/store/';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {FormDataValuesModel} from '../../models/form-data-values.model';

/**
 * Bootstraps the Register Components
 */

@Component({
  selector: 'app-prd-register-component',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromStore.RegistrationState>) {}

  pageItems: any; // todo add the type
  pageValues: FormDataValuesModel;
  $routeSubscription: Subscription;
  $pageItemsSubscription: Subscription;
  $nextUrlSubscription: Subscription;
  data$: Observable<FormDataValuesModel>;
  isFromSubmitted$: Observable<boolean>;
  nextUrl: string;
  pageId: string;
  isPageValid = false;

  ngOnInit(): void {
    this.subscribeToRoute();
    this.subscribeToPageItems();
    this.data$ = this.store.pipe(select(fromStore.getRegistrationPagesValues));
    this.isFromSubmitted$ = this.store.pipe(select(fromStore.getIsRegistrationSubmitted));
    this.$nextUrlSubscription = this.store.pipe(select(fromStore.getRegNextUrl)).subscribe((nextUrl) => {
      if (nextUrl) {
        this.store.dispatch(new fromRoot.Go({
          path: ['/register-org/register', nextUrl]
        }));
      }
    });
  }

  subscribeToRoute(): void {
    this.$routeSubscription = this.store.pipe(select(fromStore.getCurrentPage)).subscribe((routeParams) => {
      if (routeParams.pageId && routeParams.pageId !== this.pageId) { // TODO see why double call.
        this.pageId = routeParams.pageId;
        this.store.dispatch(new fromStore.LoadPageItems(this.pageId));
      }
    });
  }

  subscribeToPageItems(): void {
    this.$pageItemsSubscription = this.store.pipe(select(fromStore.getCurrentPageItems))
      .subscribe(formData => {
        if (this.pageId && formData.pageItems && formData.pageValues) {
          this.pageValues  = formData.pageValues;
          this.pageItems = formData.pageItems ? formData.pageItems.meta : undefined;
          this.nextUrl = formData.nextUrl;
        }
      });
  }

  onPageContinue(formDraft): void {
    if (formDraft.invalid ) {
      this.isPageValid = true;
    } else {
      this.isPageValid = false;
      const { value } = formDraft;
      this.store.dispatch(new fromStore.SaveFormData({value, pageId: this.pageId}));

    }
  }

  ngOnDestroy(): void {
    this.$pageItemsSubscription.unsubscribe();
    this.$routeSubscription.unsubscribe();
    this.$nextUrlSubscription.unsubscribe();
  }

  onSubmitData(): void {
    this.store.dispatch( new fromStore.SubmitFormData(this.pageValues));
  }

  onGoBack(event) {
    this.store.dispatch(new fromRoot.Back());
  }
}

