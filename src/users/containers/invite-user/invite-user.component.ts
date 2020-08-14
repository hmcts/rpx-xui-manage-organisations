import {Component, OnDestroy, OnInit} from '@angular/core';
import { AbstractControlOptions, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {Action, select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

import { User } from '@hmcts/rpx-xui-common-lib';
import { Actions, ofType } from '@ngrx/effects';
import {Observable, Subscription} from 'rxjs';
import {AppConstants} from '../../../app/app.constants';
import * as fromAppStore from '../../../app/store';
import {checkboxesBeCheckedValidator} from '../../../custom-validators/checkboxes-be-checked.validator';
import { GlobalError } from 'src/app/store/reducers/app.reducer';

/*
* User Form entry mediator component
* It holds the state
* */

@Component({
  selector: 'app-prd-invite-user-component',
  templateUrl: './invite-user.component.html',
})
export class InviteUserComponent implements OnInit, OnDestroy {

  constructor(private readonly store: Store<fromStore.UserState>,
              private readonly actions$: Actions) { }

  public inviteUserForm: FormGroup;
  public backLink: string;
  public errors$: Observable<any>;
  public errorsArray$: Observable<{ isFromValid: boolean; items: { id: string; message: any; } []}>;

  public errorMessages = {
    firstName: ['Enter first name'],
    lastName: ['Enter last name'],
    email: ['Enter email address', 'Email must contain at least the @ character'],
    roles: ['You must select at least one action'],
  };
  public jurisdictions: any[];
  public juridictionSubscription: Subscription;
  public resendInvite: boolean = false;
  public pendingUserSubscription: Subscription;
  public showWarningMessage: boolean;

  public ngOnInit(): void {
    this.showWarningMessage = false;
    this.dispathAction(new fromStore.Reset(), this.store);
    this.resendInvite = false;
    this.errors$ = this.store.pipe(select(fromStore.getInviteUserErrorMessage));
    this.errorsArray$ = this.store.pipe(select(fromStore.getGetInviteUserErrorsArray));

    this.inviteUserForm = this.initialiseUserForm();
    this.backLink = this.getBackLink(null);
    this.pendingUserSubscription = this.store.pipe(select(fromStore.getGetReinvitePendingUser)).subscribe(pendingUser => {
      this.populateFormControl(pendingUser, this.inviteUserForm);
      this.backLink = this.getBackLink(pendingUser);
    });

    this.juridictionSubscription = this.store.pipe(select(fromAppStore.getAllJurisdictions))
                                   .subscribe(value => this.jurisdictions = value,
                                   (error) => this.store.dispatch(new fromAppStore.LoadJurisdictionsFail(error)));
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

  public handleError(store: Store<any>, errorNumber: number) {
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
      url: '/get-help'
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

  public dispathAction(action: Action, store: Store<any>) {
    store.dispatch(action);
  }

  public initialiseUserForm(): FormGroup {
    return new FormGroup({
      firstName: this.createFormControl('', Validators.required),
      lastName: this.createFormControl('', Validators.required),
      email: this.createFormControl('', [Validators.email, Validators.required]),
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
      'pui-finance-manager': this.createFormControl('')
    }, checkBoxValidator);
  }

  public populateFormControl(pendingUser: User, inviteUserForm: FormGroup) {
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
  public get f() { return this.inviteUserForm.controls; }

  public onSubmit() {
    this.showWarningMessage = false;
    this.dispatchValidationAction();
    if (this.inviteUserForm.valid) {
      let value = this.inviteUserForm.getRawValue();
      const permissions = Object.keys(value.roles).filter(key => {
        if (value.roles[key]) {
          return key;
        }
      });

      const ccdRoles = this.inviteUserForm.value.roles['pui-case-manager'] ? AppConstants.CCD_ROLES : [];

      if (this.jurisdictions.length == 0) {
        this.juridictionSubscription = await this.store.pipe(select(fromAppStore.getAllJurisdictions))
          .subscribe(value => this.jurisdictions = value,
            (error) => this.store.dispatch(new fromAppStore.LoadJurisdictionsFail(error)));
      }

      const roles = [
        ...permissions,
        ...ccdRoles
      ];
      value = {
        ...value,
        roles,
        jurisdictions: this.jurisdictions,
        resendInvite: this.resendInvite
      };
      this.store.dispatch(new fromStore.SendInviteUser(value));
    }
  }

  public dispatchValidationAction() {
    // set form errors
    const formValidationData = {
      isInvalid: {
        firstName: [(this.f.firstName.errors && this.f.firstName.errors.required)],
        lastName: [(this.f.lastName.errors && this.f.lastName.errors.required)],
        email: [
          (this.f.email.errors && this.f.email.errors.required),
          (this.f.email.errors && this.f.email.errors.email),
        ],
        roles: [(this.f.roles.errors && this.f.roles.errors.requireOneCheckboxToBeChecked)],
      },
      errorMessages: this.errorMessages,
      isSubmitted: true
    };
    this.store.dispatch(new fromStore.UpdateErrorMessages(formValidationData));
  }

  public ngOnDestroy(): void {
    this.unSubscribe(this.juridictionSubscription);
    this.unSubscribe(this.pendingUserSubscription);
  }

  public unSubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }
}
