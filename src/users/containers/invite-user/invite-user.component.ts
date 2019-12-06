import {Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

import * as fromAppStore from '../../../app/store';
import {checkboxesBeCheckedValidator} from '../../../custom-validators/checkboxes-be-checked.validator';
import {Observable, Subscription} from 'rxjs';
import {AppConstants} from '../../../app/app.constants';

/*
* User Form entry mediator component
* It holds the state
* */

@Component({
  selector: 'app-prd-invite-user-component',
  templateUrl: './invite-user.component.html',
})
export class InviteUserComponent implements OnInit, OnDestroy {

  constructor(private store: Store<fromStore.UserState>) { }
  inviteUserForm: FormGroup;

  errors$: Observable<any>;
  errorsArray$: Observable<{ isFromValid: boolean; items: { id: string; message: any; } []}>;

  errorMessages = {
    firstName: ['Enter first name'],
    lastName: ['Enter last name'],
    email: ['Enter email address', 'Email must contain at least the @ character'],
    roles: ['You must select at least one action'],
  };
  jurisdictions: any[];
  juridictionSubscription: Subscription;

  ngOnInit(): void {

    this.errors$ = this.store.pipe(select(fromStore.getInviteUserErrorMessage));
    this.errorsArray$ = this.store.pipe(select(fromStore.getGetInviteUserErrorsArray));

    this.inviteUserForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      roles: new FormGroup({
        'pui-case-manager': new FormControl(''),
        'pui-user-manager': new FormControl(''),
        'pui-organisation-manager': new FormControl(''),
        'pui-finance-manager': new FormControl('')
      }, checkboxesBeCheckedValidator())
    });
    this.juridictionSubscription = this.store.pipe(select(fromAppStore.getAllJuridictions))
                                   .subscribe(value => this.jurisdictions = value,
                                   (error) => this.store.dispatch(new fromAppStore.LoadJurisdictionsFail(error)));
    this.store.dispatch(new fromAppStore.LoadJurisdictions());
  }

  // convenience getter for easy access to form fields
  get f() { return this.inviteUserForm.controls; }

  onSubmit() {
    this.dispatchValidationAction();
    if (this.inviteUserForm.valid) {
      let {value} = this.inviteUserForm;
      const permissions = Object.keys(value.roles).filter(key => {
        if (value.roles[key]) {
          return key;
        }
      });

      const ccdRoles = this.inviteUserForm.value.roles['pui-case-manager'] ? AppConstants.CCD_ROLES : [];

      const roles = [
        ...permissions,
        ...ccdRoles
      ];
      value = {
        ...value,
        roles,
        jurisdictions: this.jurisdictions
      };
      this.store.dispatch(new fromStore.SendInviteUser(value));
    }
  }

  dispatchValidationAction() {
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

  ngOnDestroy(): void {
    if (this.juridictionSubscription) {
      this.juridictionSubscription.unsubscribe();
    }
  }
}
