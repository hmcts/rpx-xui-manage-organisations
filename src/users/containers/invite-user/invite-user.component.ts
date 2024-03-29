import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { User } from '@hmcts/rpx-xui-common-lib';
import { Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AppConstants } from '../../../app/app.constants';
import * as fromAppStore from '../../../app/store';
import { GlobalError } from '../../../app/store/reducers/app.reducer';
import { checkboxesBeCheckedValidator } from '../../../custom-validators/checkboxes-be-checked.validator';
import * as fromStore from '../../store';

/*
* User Form entry mediator component
* It holds the state
* */
@Component({
  selector: 'app-prd-invite-user-component',
  templateUrl: './invite-user.component.html'
})
export class InviteUserComponent implements OnInit, OnDestroy {
  public inviteUserForm: FormGroup;
  public backLink: string;
  public errors$: Observable<any>;
  public errorsArray$: Observable<{ isFromValid: boolean; items: { id: string; message: any; } []}>;
  public errorMessages = {
    firstName: ['Enter first name'],
    lastName: ['Enter last name'],
    email: ['Enter a valid email address'],
    roles: ['You must select at least one action']
  };

  public juridictionSubscription: Subscription;
  public resendInvite: boolean = false;
  public pendingUserSubscription: Subscription;
  public showWarningMessage: boolean;

  constructor(
    private readonly store: Store<fromStore.UserState>,
    private readonly actions$: Actions
  ) {}

  public ngOnInit(): void {
    this.showWarningMessage = false;
    this.dispathAction(new fromStore.Reset(), this.store);
    this.resendInvite = false;
    this.errors$ = this.store.pipe(select(fromStore.getInviteUserErrorMessage));
    this.errorsArray$ = this.store.pipe(select(fromStore.getGetInviteUserErrorsArray));
    this.inviteUserForm = this.initialiseUserForm();
    this.backLink = this.getBackLink(null);
    this.pendingUserSubscription = this.store.pipe(select(fromStore.getGetReinvitePendingUser)).subscribe((pendingUser) => {
      this.populateFormControl(pendingUser, this.inviteUserForm);
      this.backLink = this.getBackLink(pendingUser);
    });
    this.dispathAction(new fromAppStore.LoadJurisdictions(), this.store);
    this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_400)).subscribe(() => {
      this.handleError(this.store, 400);
    });
    this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_404)).subscribe(() => {
      this.handleError(this.store, 404);
    });
    this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_500)).subscribe(() => {
      this.handleError(this.store, 500);
    });
    this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_429)).subscribe(() => {
      this.showWarningMessage = true;
    });
    this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL_WITH_409)).subscribe(() => {
      this.showWarningMessage = true;
    });
    this.actions$.pipe(ofType(fromStore.INVITE_USER_FAIL)).subscribe(() => {
      this.store.dispatch(new fromAppStore.Go({ path: ['service-down'] }));
    });
  }

  public ngOnDestroy(): void {
    this.unSubscribe(this.juridictionSubscription);
    this.unSubscribe(this.pendingUserSubscription);
  }

  public handleError(store: Store<any>, errorNumber: number): void {
    const globalError = this.getGlobalError(errorNumber);
    if (globalError) {
      store.dispatch(new fromAppStore.AddGlobalError(globalError));
      store.dispatch(new fromAppStore.Go({ path: ['service-down'] }));
    }
  }

  public getGlobalError(error: number): GlobalError {
    const mappedError = {
      400: this.get400Error(),
      404: this.get404Error(),
      500: this.get500Error()
    };
    return mappedError[error];
  }

  public get500Error(): GlobalError {
    const errorMessages = [{
      bodyText: 'Try again later.',
      urlText: null,
      url: null
    },
    {
      bodyText: null,
      urlText: 'Go back to manage users',
      url: '/users'
    }];
    const globalError = {
      header: 'Sorry, there is a problem with the service',
      errors: errorMessages
    };
    return globalError;
  }

  public get400Error(): GlobalError {
    const errorMessage = {
      bodyText: 'to check the status of the user',
      urlText: 'Refresh and go back',
      url: '/users'
    };
    const globalError = {
      header: 'Sorry, there is a problem',
      errors: [errorMessage]
    };
    return globalError;
  }

  public get404Error(): GlobalError {
    const errorMessages = [{
      bodyText: 'to reactivate this account',
      urlText: 'Get help',
      url: '/get-help',
      newTab: true
    },
    {
      bodyText: null,
      urlText: 'Go back to manage users',
      url: '/users'
    }];
    const globalError = {
      header: 'Sorry, there is a problem with this account',
      errors: errorMessages
    };
    return globalError;
  }

  public dispathAction(action: Action, store: Store<any>): void {
    store.dispatch(action);
  }

  public initialiseUserForm(): FormGroup {
    return new FormGroup({
      firstName: this.createFormControl('', Validators.required),
      lastName: this.createFormControl('', Validators.required),
      email: this.createFormControl('', [Validators.required, Validators.email]),
      roles: this.createFormGroup(checkboxesBeCheckedValidator())
    });
  }

  public createFormControl(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions): FormControl {
    return new FormControl(formState, validatorOrOpts);
  }

  public createFormGroup(checkBoxValidator: ValidatorFn): FormGroup {
    return new FormGroup({
      'pui-case-manager': this.createFormControl(''),
      'pui-user-manager': this.createFormControl(''),
      'pui-organisation-manager': this.createFormControl(''),
      'pui-finance-manager': this.createFormControl(''),
      'pui-caa': this.createFormControl('')
    }, checkBoxValidator);
  }

  public populateFormControl(pendingUser: User, inviteUserForm: FormGroup): void {
    if (pendingUser) {
      this.resendInvite = true;
      inviteUserForm.controls.firstName.setValue(pendingUser.firstName);
      inviteUserForm.controls.lastName.setValue(pendingUser.lastName);
      inviteUserForm.controls.email.setValue(pendingUser.email);
      inviteUserForm.controls.firstName.disable();
      inviteUserForm.controls.lastName.disable();
      inviteUserForm.controls.email.disable();
    }
  }

  public getBackLink(pendingUser?: User): string {
    return pendingUser ? `/users/user/${pendingUser.userIdentifier}` : '/users';
  }

  // convenience getter for easy access to form fields
  public get f() {
    return this.inviteUserForm.controls;
  }

  public onSubmit(): void {
    this.showWarningMessage = false;
    this.dispatchValidationAction();
    if (this.inviteUserForm.valid) {
      const value = this.inviteUserForm.getRawValue();
      const permissions = Object.keys(value.roles).filter((key) => {
        if (value.roles[key]) {
          return key;
        }
      });
      const ccdRoles = this.inviteUserForm.value.roles['pui-case-manager'] ? AppConstants.CCD_ROLES : [];
      this.callInviteuser(permissions, ccdRoles, value);
    }
  }

  private callInviteuser(permissions: string[], ccdRoles: string[], value) {
    const roles = [
      ...permissions,
      ...ccdRoles
    ];
    value = {
      ...value,
      roles,
      resendInvite: this.resendInvite
    };
    this.store.dispatch(new fromStore.SendInviteUser(value));
    return value;
  }

  public dispatchValidationAction(): void {
    // set form errors
    const formValidationData = {
      isInvalid: {
        firstName: [(this.f.firstName.errors && this.f.firstName.errors.required)],
        lastName: [(this.f.lastName.errors && this.f.lastName.errors.required)],
        email: [(this.f.email.errors && (this.f.email.errors.required || this.f.email.errors.email))],
        roles: [(this.f.roles.errors && this.f.roles.errors.requireOneCheckboxToBeChecked)]
      },
      errorMessages: this.errorMessages,
      isSubmitted: true
    };
    this.store.dispatch(new fromStore.UpdateErrorMessages(formValidationData));
  }

  public unSubscribe(subscription: Subscription): void {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
