import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '../../services/form-builder-validation.service';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html'
})
export class InputsComponent {
    @Input() public group: FormGroup;
    @Input() public item;
    @Input() public label;
    @Input() public hint;
    @Input() public labelFor;
    @Input() public showValidation;
    @Input() public validationError;
    public name;
    public id;

    constructor(private validationService: ValidationService) {
    }

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
    public isControlInvalidAndShowValidation(formGroup: FormGroup, control: string, showValidation: boolean) {

        return !this.isFormControlValid(formGroup, control) && showValidation;
    }

    /**
     * Checks if this control is valid.
     *
     * // @see ValidationService
     */
    public isFormControlValid(formGroup: FormGroup, control: string): boolean {
        return this.validationService.isFormControlValid(formGroup, control);
    }
}
