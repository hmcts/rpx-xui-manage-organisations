import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

import {checkboxesBeCheckedValidator} from '../../../custom-validators/checkboxes-be-checked.validator';
import {Observable} from 'rxjs';
import {dateValidator} from '../../../custom-validators/date.validator';
import {StyleGuideFormDataModel} from '../../models/style-guide-form-data.model';

/*
* Style Guide Mediator Component
* It holds the state
* */

@Component({
  selector: 'app-prd-user-form-component',
  templateUrl: './style-guide.component.html',
})
export class StyleGuideComponent implements OnInit {

  constructor(private store: Store<fromStore.UserState>) { }
  styleGuideForm: FormGroup;

  formValidationErrors$: Observable<any>;
  formValidationErrorsArray$: Observable<{isFromValid: boolean; items: { id: string; message: any; }[]}>;

  errorMessages: StyleGuideFormDataModel = {
    input: ['Enter first name', 'Email must contain at least the @ character'],
    checkboxes: ['Select at least one option'],
    passport: ['Please enter valid date'],
    contactPreference: ['Select one option'],
    sortBy: ['Please select at least one option'],
    moreDetails: ['Please provide more details']
  };

  ngOnInit(): void {
    this.formValidationErrors$ = this.store.pipe(select(fromStore.getStyleGuideErrorMessage));
    this.formValidationErrorsArray$ = this.store.pipe(select(fromStore.getGetStyleGuideErrorsArray));
    // TODO add type
    this.styleGuideForm = new FormGroup({
      input: new FormControl('', [Validators.required, Validators.email]),
      checkboxes: new FormGroup({ // checkboxes
        createCases: new FormControl(''),
        viewCases: new FormControl(''),
      }, checkboxesBeCheckedValidator()),
      contactPreference: new FormControl('', Validators.required),
      passport: new FormGroup({ // date
        day: new FormControl(''),
        month: new FormControl(''),
        year: new FormControl('')
      }, dateValidator()),
      sortBy: new FormControl('', Validators.required),
      moreDetails: new FormControl('', Validators.required)
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.styleGuideForm.controls; }

  onSubmit() {
    this.dispatchValidation();
    // this is where the form values would get dispatched
    // const {value} = this.styleGuideForm;
  }

  dispatchValidation() {
    /*
    * bind form errors to an object
    * to be used later to display error messages
    * what normally is done by default in Angular when double binding is used.
    * */
    const formValidationData = {
      isInvalid: {
        input: [
          (this.f.input.errors && this.f.input.errors.required),
          (this.f.input.errors && this.f.input.errors.email)
        ],
        checkboxes: [(this.f.checkboxes.errors && this.f.checkboxes.errors.requireOneCheckboxToBeChecked)],
        passport: [(this.f.passport.errors && this.f.passport.errors.dateIsInvalid)],
        contactPreference: [(this.f.contactPreference.errors && this.f.contactPreference.errors.required)],
        sortBy: [(this.f.sortBy.errors && this.f.sortBy.errors.required)],
        moreDetails: [(this.f.moreDetails.errors && this.f.moreDetails.errors.required)]
      },
      errorMessages: this.errorMessages,
      isSubmitted: true
    };
    this.store.dispatch(new fromStore.UpdateErrorMessages(formValidationData));
  }


}

