import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store/';
import * as fromRoot from '../../../app/store/';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {FormDataValuesModel} from '../../models/form-data-values.model';
import { async } from 'q';

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
  errorMessage: any;

  ngOnInit(): void {
    this.subscribeToRoute();
    this.subscribeToPageItems();
    this.data$ = this.store.pipe(select(fromStore.getRegistrationPagesValues));
    this.isFromSubmitted$ = this.store.pipe(select(fromStore.getIsRegistrationSubmitted));
    // does it get to here?
    // it does not hit here at all when we have previously hit the back button.
    // so it still is subscribes
    // nextUrlSubscription would never change when the user goes back, therefore,
    // a subscription to it would never kick off, therefore the go is never called.
    // so over here we're
    this.$nextUrlSubscription = this.store.pipe(select(fromStore.getRegNextUrl)).subscribe((nextUrl) => {
      console.log('nextUrlSubscription');
      console.log(nextUrl);
      if (nextUrl) {
        this.store.dispatch(new fromRoot.Go({
          path: ['/register-org/register', nextUrl]
        }));
      }
    });

    this.errorMessage = this.store.pipe(select(fromStore.getErrorMessages));

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

  showFormValidation(isValid) {
    this.isPageValid = isValid;
  }

  onPageContinue(formDraft): void {

    console.log('onPageContinue')
    console.log('Is form invalid?')
    console.log(formDraft.invalid)

    console.log('formDraft')
    console.log(formDraft)
    // Why is this invalid when the user goes backwards?
    // if it's true ie. it's valid then we save the
    // form data
    // if not it's invalid and we should show the form validation.
    // so if it's not valid then we pass into the form builder component
    // that we should show the validation issues.
    if (formDraft.invalid ) {
      console.log('We should show the form validation.');
      this.showFormValidation(true);
    } else {
      console.log('We should not show the form validation.');
      console.log('We should save the form data.');
      this.showFormValidation(false);
      const { value } = formDraft;
      this.store.dispatch(new fromStore.SaveFormData({value, pageId: this.pageId}));

    }
  }

  ngOnDestroy(): void {
    this.$pageItemsSubscription.unsubscribe();
    this.$routeSubscription.unsubscribe();
    this.$nextUrlSubscription.unsubscribe();
    this.store.dispatch(new fromStore.ResetErrorMessage({}));
  }

  onSubmitData(): void {
    this.store.dispatch( new fromStore.SubmitFormData(this.pageValues));
  }

  // Shoudl we get it to listen to pageValues, probably not, as these won't change until
  //
  onGoBack(event) {
    this.store.dispatch( new fromStore.ResetNextUrl());
    this.store.dispatch(new fromRoot.Back());
  }
}

