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
    @Input() public group: FormGroup;
    @Input() public idPrefix = 'ta';
    @Input() public name = 'ta';
    @Input() public id = 'ta';
    @Input() public labelFor;
    @Input() public rows;
    @Input() public classes;
    @Input() public control;
    @Input() public showValidation;
    @Input() public label;
    @Input() public items;
    @Input() public validationError;

    constructor(private validationService: ValidationService) {
    }

    public isGroupInvalidAndShowValidation(formGroup: FormGroup, showValidation: boolean) {

            if (formGroup.errors && formGroup.errors[this.control] && showValidation) {
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
