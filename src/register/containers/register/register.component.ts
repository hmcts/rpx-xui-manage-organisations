import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppConstants } from 'src/app/app.constants';
import { EnvironmentService } from 'src/shared/services/environment.service';
import * as fromRoot from '../../../app/store/';
import { FormDataValuesModel } from '../../models/form-data-values.model';
import * as fromStore from '../../store/';

/**
 * Bootstraps the Register Components
 */

@Component({
  selector: 'app-prd-register-component',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private readonly router: Router,
    private readonly store: Store<fromStore.RegistrationState>,
    private readonly enviromentService: EnvironmentService) {}

  public pageItems: any; // todo add the type
  public pageValues: FormDataValuesModel;
  public $routeSubscription: Subscription;
  public $pageItemsSubscription: Subscription;
  public $nextUrlSubscription: Subscription;
  public data$: Observable<FormDataValuesModel>;
  public isFromSubmitted$: Observable<boolean>;
  public isFormDataLoaded$: Observable<boolean>;

  public nextUrl: string;
  public pageId: string;
  public isPageValid = false;
  public errorMessage: any;
  public jurisdictions: any[];

  public manageCaseLink$: Observable<string>;
  public manageOrgLink$: Observable<string>;

  /**
   * ngOnInit
   *
   * <code>this.$nextUrlSubscription</code>
   * We listen to nextUrl on the Store. When nextUrl on the store changes we dispatch an action to navigate the User to the next Url (page).
   */
  public ngOnInit(): void {
    this.subscribeToRoute();
    this.subscribeToPageItems();
    this.data$ = this.store.pipe(select(fromStore.getRegistrationPagesValues));
    this.isFormDataLoaded$ = this.store.pipe(select(fromStore.getRegistrationLoading));
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
    });
    this.errorMessage = this.store.pipe(select(fromStore.getErrorMessages));
    this.jurisdictions = AppConstants.JURISDICTIONS;

    this.manageCaseLink$ = this.enviromentService.config$.pipe(map(config => config.manageCaseLink));
    this.manageOrgLink$ = this.enviromentService.config$.pipe(map(config => config.manageOrgLink));
  }

  public ngAfterViewInit() {
    this.resetFocus();
  }

  // Set to focus to the title when the page/next route url started for accessibility
  public resetFocus(): void {
    const focusElement = document.getElementsByTagName('h1')[0];
    if (focusElement) {
      focusElement.setAttribute('tabindex', '-1');
      focusElement.focus();
    }
  }

  public subscribeToRoute(): void {
    this.$routeSubscription = this.store.pipe(select(fromStore.getCurrentPage)).subscribe((routeParams) => {
      if (routeParams.pageId && routeParams.pageId !== this.pageId) { // TODO see why double call.
        this.pageId = routeParams.pageId;
        this.store.dispatch(new fromStore.LoadPageItems(this.pageId));
      }
    });

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.resetFocus();
    });
  }

  public subscribeToPageItems(): void {
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
  public showFormValidation(isValid: boolean) {
    this.isPageValid = isValid;
  }

  public onPageContinue(formDraft): void {
    if (formDraft.invalid ) {
      this.showFormValidation(true);
    } else {
      this.showFormValidation(false);
      const { value } = formDraft;
      this.store.dispatch(new fromStore.SaveFormData({value, pageId: this.pageId}));

    }
  }

  public ngOnDestroy(): void {
    this.$pageItemsSubscription.unsubscribe();
    this.$routeSubscription.unsubscribe();
    this.$nextUrlSubscription.unsubscribe();
    this.store.dispatch(new fromStore.ResetErrorMessage({}));
  }

  public onSubmitData(): void {
    const pageValues = {
      ...this.pageValues,
      jurisdictions: this.jurisdictions
    };
    this.store.dispatch( new fromStore.SubmitFormData(pageValues));
  }

  public onGoBack(event) {
    this.store.dispatch(new fromStore.ResetNextUrl());
    this.store.dispatch(new fromRoot.Back());
  }
}

