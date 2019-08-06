import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store/';
import * as fromRoot from '../../../app/store/';
import * as fromAppStore from '../../../app/store';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {FormDataValuesModel} from '../../models/form-data-values.model';
import { AppConstants } from 'src/app/app.constants';

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
  jurisdictions: any[];

  /**
   * ngOnInit
   *
   * <code>this.$nextUrlSubscription</code>
   * We listen to nextUrl on the Store. When nextUrl on the store changes we dispatch an action to navigate the User to the next Url (page).
   */
  ngOnInit(): void {
    this.subscribeToRoute();
    this.subscribeToPageItems();
    this.data$ = this.store.pipe(select(fromStore.getRegistrationPagesValues));
    this.isFromSubmitted$ = this.store.pipe(select(fromStore.getIsRegistrationSubmitted));
    this.isFromSubmitted$.subscribe((submitted: boolean) => {
      if (submitted) {
        this.router.navigateByUrl('/register-org/confirmation');
      }
    });

    this.$nextUrlSubscription = this.store.pipe(select(fromStore.getRegNextUrl)).subscribe((nextUrl) => {
      if (nextUrl) {
        this.store.dispatch(new fromRoot.Go({
          path: ['/register-org/register', nextUrl]
        }));
      }
      this.store.dispatch(new fromAppStore.LoadJurisdictions());
    });
    this.errorMessage = this.store.pipe(select(fromStore.getErrorMessages));
    this.jurisdictions = AppConstants.JURISDICTIONS;
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
          this.store.dispatch(new fromStore.ResetNextUrl());
        }
      });
  }

  /**
   * Show Form Validation
   *
   * Inform the Form Builder component to turn on or off the in-line form validation.
   */
  showFormValidation(isValid: boolean) {
    this.isPageValid = isValid;
  }

  onPageContinue(formDraft): void {
    if (formDraft.invalid ) {
      this.showFormValidation(true);
    } else {
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
    const pageValues = {
      ...this.pageValues,
      jurisdictions: this.jurisdictions
    };
    this.store.dispatch( new fromStore.SubmitFormData(pageValues));
  }

  onGoBack(event) {
    this.store.dispatch(new fromStore.ResetNextUrl());
    this.store.dispatch(new fromRoot.Back());
  }
}

