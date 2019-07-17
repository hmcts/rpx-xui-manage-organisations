import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {ValidationErrors, ValidatorFn} from '@angular/forms';

export default interface ICustomValidatorsService {
  exactLengthValidator(length: number): ValidatorFn;
}

@Injectable({
  providedIn: 'root'
})

/**
 * Custom Validators for Form Controls
 */
export class CustomValidatorsService implements ICustomValidatorsService {

  /**
   * Check if a controls value's string length is an exact length.
   *
   * ie. Is length of a string 13 characters, no more, no less.
   *
   * @param length - 13
   * @returns ValidatorFn
   */
  exactLengthValidator(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      return (control.value.length === length) ? null : this.validationError('exactLengthError', control.value);
    };
  }

  /**
   * Validation Error
   *
   * Defines the format of an ng Validation error.
   *
   * @param validationErrorName - developer assigned name of the validation
   * @param validationErrorMessage - developer assigned validation message
   * @see https://angular.io/api/forms/ValidationErrors
   * @returns
   */
  validationError(validationErrorName, validationErrorMessage): ValidationErrors {
    return {
      validationErrorName: {
        value: validationErrorMessage
      }
    };
  }
}
