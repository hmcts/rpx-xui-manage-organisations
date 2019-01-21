import {Injectable} from '@angular/core';
import {Form, FormGroup} from '@angular/forms';
import {Validators, ValidationErrors, ValidatorFn} from '@angular/forms';
import {controlsisTextAreaValidWhenCheckboxChecked, FormGroupValidator} from './form-group-validation.typescript';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // FOR SINGLE CONTROLS - formGroup.control level validation
  /**
   * Custom validators can be added to this.
   *
   * TODO : Define interface for array.
   * TODO : Add a Custom Validator example.
   *
   * @see https://angular.io/guide/form-validation#custom-validators
   */
  ngValidatorFunctionMap: Array<any> = [
    {
      simpleName: 'required',
      ngValidatorFunction: Validators.required
    },
    {
      simpleName: 'email',
      ngValidatorFunction: Validators.email
    },
  ];

  constructor() {
  }

  /**
   * Returns a map of how we've mapped simple names to Ng Validators, and in the future custom validators.
   *
   * TODO: Check return in Unit test.
   *
   * @return Array
   */
  getNgValidationFunctionMap() {
    return this.ngValidatorFunctionMap;
  }

  /**
   * Takes in an array of simple validation names.
   *
   * These names map to Ng Validation functions, and can map to more complex custom validation functions.
   *
   * This allows us to leverage the power of Ng Validation, and custom validation, as well as giving us
   * the ability to create reusable validators, that can be used throughout our forms.
   *
   * Note: Validators.minLength requires Validators.required
   *
   * TODO: Unit test.
   *
   * @see state_meta
   * @param validators - ie. ['required', 'email']
   */
  getNgValidators(validators: Array<string>) {

    const ngValidators: Array<any> = [];

    validators.forEach((validatorName) => {
      for (const ngValidatorFunction of this.getNgValidationFunctionMap()) {
        if (ngValidatorFunction.simpleName === validatorName) {
          ngValidators.push(ngValidatorFunction.ngValidatorFunction);
        }
      }
    });

    return ngValidators;
  }

  /**
   * Checks if validators have been set on the control, an example of a validator being set on a control is:
   *
   * {
   *  control: 'informationNeeded',
   *  value: 'Information text',
   *  validators: ['required']
   * }
   *
   * TODO: Unit test.
   *
   * @param {Array} validators - ['required']
   * @return {boolean}
   */
  controlHasValidation(validators: Array<string>): boolean {

    return validators && validators.length > 0;
  }

  /**
   * Checks if the control is valid.
   *
   * Returns a boolean, based on if the control which is part
   * of a form group is valid or not.
   *
   * TODO: Unit test.
   *
   * @param {FormGroup} formGroup
   * @param {String} control - 'informationNeeded'
   * @return {boolean}
   */
  isFormControlValid(formGroup: FormGroup, control: string): boolean {

    return formGroup.get(control).valid;
  }

  // FOR MULTIPLY CONTROLS - formGroup level validation.
  /**
   * Is Form Group Invalid
   *
   * Checks if a validation error has been thrown on the pages Angular FormGroup.
   *
   * FormGroup is a the parent of FormControls, and therefore and according to the Angular
   * Docs the best place to validate against multiply controls, that have dependencies upon one
   * another is on the FormGroup level.
   *
   * An example being; we should check if a user has checked one of eight checkboxes.
   *
   * TODO : Unit Test
   *
   * @see ValidationService
   * @param {FormGroup} formGroup
   * @param {string} validationErrorId - ie. 'reasonsConstentOrderNotApproved' - This is the validation identifier
   * we assign to a group of form controls, we assign this when we currently setValidators(), note that we will
   * need to pass this in once the Universal Form Builder is merged with Validation.
   * @return {boolean}
   */
  isFormGroupInvalid(formGroup: FormGroup, validationErrorId: string): boolean {

    if (formGroup.errors && formGroup.errors.hasOwnProperty(validationErrorId)) {
      return formGroup.errors[validationErrorId];
    } else {
      return null;
    }
  }

  /**
   * isAnyCheckboxChecked
   *
   * Checks if any of the checkbox controls passed to this function are checked ie. have a boolean value
   * of true.
   *
   * This is due to the fact that we might have multiply checkboxes within the view, and the user needs to
   * select at least one of these checkboxes to have entered a valid input.
   *
   * Note that we validate on the formGroup level, and not the control level for this as we are concerned with
   * multiple controls and the Ng 6 way is to have the validator on a common ancestor of controls; in this
   * case our formGroup.
   *
   * If the user has checked a checked box this function returns null and therefore no validation error is returned.
   * If the user has NOT checked a checkbox this function returns a validation error.
   *
   * @param formGroup
   * @param {string} validationIdentifier - An error name assigned by the developer, this name can then be referred
   * to display the error in the  view.
   * @return {any}
   */
  isAnyCheckboxChecked(formGroup: FormGroup, checkboxes: Array<string>, validationIdentifier: string): ValidatorFn | null {

    const isAnyCheckboxCheckedValidationFn: ValidatorFn = (controls: FormGroup): ValidationErrors | null => {

      for (const checkbox of checkboxes) {
        if (controls.get(checkbox).value) {
          return null;
        }
      }

      return {
        [validationIdentifier]: true,
      };
    };

    return isAnyCheckboxCheckedValidationFn;
  }


  isAllFieldsRequired(formGroup: FormGroup, fields: Array<string>, validationIdentifier: string): ValidatorFn | null {

    const isAllFieldsRequiredValidationFn: ValidatorFn = (controls: FormGroup): ValidationErrors | null => {

      for (const field of fields) {
        if (!controls.get(field).value) {
          return {
            [validationIdentifier]: true
          };
        }
      }
    };

    return isAllFieldsRequiredValidationFn;
  }

  /**
   * isTextAreaValidWhenCheckboxChecked
   *
   * @param formGroup
   * @param controls is object
   * { checkboxControl : string, textareaControl : string }
   * @param validationIdentifier
   * @return {any}
   */

  isTextAreaValidWhenCheckboxChecked(formGroup: FormGroup, controls: controlsisTextAreaValidWhenCheckboxChecked, validationIdentifier: string) {


    const isTextAreaValidWhenCheckboxChecked: ValidatorFn = (formControls: FormGroup): ValidationErrors | null => {

      if (!formControls.get(controls.checkboxControl).value) {
        return null;
      }

      if (formControls.get(controls.textareaControl).value.length > 0) {
        return null;
      }

      return {
        [validationIdentifier]: true,
      };
    };

    return isTextAreaValidWhenCheckboxChecked;
  }

  /**
   * createFormGroupValidators
   *
   * FormGroup Validators are used for validation that involves more than one FormControl. ie. When a control
   * depends on another, or we need to validate a group of controls together. Validation for multiply controls is
   * required on the common ancestor as per the Angular Documentation.
   *
   * @see @see https://angular.io/guide/form-validation#adding-to-reactive-forms-1
   *
   * @param {FormGroup} formGroup - Angular FormGroup
   * @param formGroupValidators - [{
   *    validatorFunc: 'isAnyCheckboxChecked',
   *    validationErrorId: 'reasonsConstentOrderNotApproved',
   *    checkboxes: [
   *        'partiesNeedAttend', 'NotEnoughInformation', 'orderNotAppearOfS25ca1973', 'd81',
   *        'pensionAnnex', 'applicantTakenAdvice', 'respondentTakenAdvice', 'Other2'
   *    ]}]
   */
  createFormGroupValidators(formGroup: FormGroup, formGroupValidators) {

    return formGroupValidators.map(formGroupValidator => {

      const groupValidator: FormGroupValidator = formGroupValidator;

      return this.createFormGroupValidator(formGroup, groupValidator.validatorFunc, groupValidator.controls,
        groupValidator.validationErrorId);
    });
  }

  /**
   * createFormGroupValidator
   *
   * You'll need to pass in the name of the validator function that you wish to use.
   *
   * @see state_meta.js
   *
   * @param formGroup
   * @param {String} validatorFunc - 'isAnyCheckboxChecked'
   * @param {Array or Object} controls - ['partiesNeedAttend', 'NotEnoughInformation'] or { checkbox: 'controlName', textarea: 'controlName' }
   * @param {String} validationErrorId - 'reasonsConstentOrderNotApproved'
   *
   * @return {ValidatorFn}
   */
  createFormGroupValidator(formGroup: FormGroup, validatorFunc: string, controls: any, validationErrorId: string): ValidatorFn {

    return this[validatorFunc](formGroup, controls, validationErrorId);
  }
}
