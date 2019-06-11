import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '../../services/form-builder-validation.service';

@Component({
    selector: 'app-textareas',
    templateUrl: './textareas.component.html'
})
/**
 * TextareasComponent
 *
 * Features:
 * If this component is told to show it's validation, and the input the user has entered is invalid,
 * then we should display a red box around the text area.
 */
export class TextareasComponent {
    @Input() group: FormGroup;
    @Input() idPrefix = 'ta';
    @Input() name = 'ta';
    @Input() id = 'ta';
    @Input() labelFor;
    @Input() rows;
    @Input() classes;
    @Input() control;
    @Input() showValidation;
    @Input() label;
    @Input() items;
    @Input() validationError;

    constructor(private validationService: ValidationService) {
    }

    isGroupInvalidAndShowValidation (formGroup: FormGroup, showValidation: boolean) {

            if(formGroup.errors && formGroup.errors[this.control] && showValidation) {
                return true;
            }

            return false;

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
    isControlInvalidAndShowValidation(formGroup: FormGroup, control: string, showValidation: boolean) {


        return !this.isFormControlValid(formGroup, control) && showValidation;
    }

    /**
     * Checks if this control is valid.
     *
     * // @see ValidationService
     */
    isFormControlValid(formGroup: FormGroup, control: string): boolean {
        return this.validationService.isFormControlValid(formGroup, control);
    }
}
