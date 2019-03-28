import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

import {checkboxesBeCheckedValidator} from '../../../custom-validators/checkboxes-be-checked.validator';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/internal/operators/tap';

/*
* User Form entry mediator component
* It holds the state
* */

@Component({
  selector: 'app-prd-user-form-component',
  templateUrl: './style-guide.component.html',
})
export class StyleGuideComponent implements OnInit {

  constructor(private store: Store<fromStore.UserState>) { }
  inviteUserForm: FormGroup;

  formValidationErrors$: Observable<any>;
  formValidationErrorsArray$: Observable<{isFromValid: boolean; items: { id: string; message: any; }[]}>

  errorMessages = {
    input: ['Enter first name', 'Email must contain at least the @ character'],
    checkboxes: ['Select at least one option'],
  }

  ngOnInit(): void {

    this.formValidationErrors$ = this.store.pipe(select(fromStore.getStyleGuideErrorMessage));
    this.formValidationErrorsArray$ = this.store.pipe(select(fromStore.getGetStyleGuideErrorsArray));

    this.inviteUserForm = new FormGroup({
      input: new FormControl('', [Validators.required, Validators.email]),
      checkboxes: new FormGroup({
        createCases: new FormControl(''),
        viewCases: new FormControl(''),
      }, checkboxesBeCheckedValidator())
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.inviteUserForm.controls; }

  onSubmit() {
    this.dispatchValidationAction();
    if (this.inviteUserForm.valid) {
      const {value} = this.inviteUserForm;
      this.store.dispatch(new fromStore.InviteUser(value));
    }
  }

  dispatchValidationAction() {
    /*
    * bind form errors to object
    * to be used later to display error messages
    * what normally is done by default when double binding is used.
    * */
    const formValidationData = {
      isInvalid: {
        input: [
          (this.f.input.errors && this.f.input.errors.required),
          (this.f.input.errors && this.f.input.errors.email)
        ],
        checkboxes: [(this.f.checkboxes.errors && this.f.checkboxes.errors.requireOneCheckboxToBeChecked)],
      },
      errorMessages: this.errorMessages,
      isSubmitted: true
    };
    this.store.dispatch(new fromStore.UpdateErrorMessages(formValidationData));
  }


}

