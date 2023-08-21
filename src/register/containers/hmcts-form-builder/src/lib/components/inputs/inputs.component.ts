import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ValidationService } from '../../services/form-builder-validation.service';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html'
})
export class InputsComponent {
  @Input() group: UntypedFormGroup;
  @Input() item;
  @Input() label;
  @Input() hint;
  @Input() labelFor;
  @Input() showValidation;
  @Input() validationError;
  name;
  id;

  constructor(private validationService: ValidationService) {}

  /**
   * showValidationAndIsControlValid
   *
   * Return true if this component is required to show it's validation, and the users input is invalid.
   *
   * // @param showValidation
   * // @param formGroup
   * // @param control
   * // @return {boolean}
   */
  isControlInvalidAndShowValidation(formGroup: UntypedFormGroup, control: string, showValidation: boolean) {
    return !this.isFormControlValid(formGroup, control) && showValidation;
  }

  /**
   * Checks if this control is valid.
   *
   * // @see ValidationService
   */
  isFormControlValid(formGroup: UntypedFormGroup, control: string): boolean {
    return this.validationService.isFormControlValid(formGroup, control);
  }
}
