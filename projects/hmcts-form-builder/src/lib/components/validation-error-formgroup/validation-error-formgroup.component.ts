import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '../../services/form-builder-validation.service';

@Component({
    selector: 'app-validation-error-formgroup',
    templateUrl: './validation-error-formgroup.component.html'
})

/**
 * Validation Error FormGroup Component
 *
 * We show an error message if the validation error associated with the FormGroup is thrown by the FormGroup.
 *
 * Note that we have validation on both FormGroup and FormControl level. FormControl level to validate single
 * controls, FormGroup level to validate multiply controls. This is the method suggested in the Angular 6 documents.
 *
 * An example of multiply controls, where we would leverage the FormGroup validation would be; checking if one
 * Checkbox is checked, out a set of multiply Checkboxes.
 *
 * // @see https://angular.io/guide/form-validation#adding-to-reactive-forms-1
 */
export class ValidationErrorFormGroupComponent {
    @Input() group: FormGroup;
    @Input() validationErrorId;

    constructor(private validationService: ValidationService) {
    }

    /**
     * Is Form Group Invalid
     *
     * TODO : Unit Test
     *
     * // @see ValidationService
     * // @param {FormGroup} formGroup
     * // @param {string} validationErrorId - ie. 'reasonsConstentOrderNotApproved' - This is the validation identifier
     * we assign to a group of form controls, we assign this when we currently setValidators(), note that we will
     * need to pass this in once the Universal Form Builder is merged with Validation.
     * // @return {boolean}
     */
    isFormGroupInvalid(formGroup: FormGroup, validationErrorId: string): boolean {
        return this.validationService.isFormGroupInvalid(formGroup, validationErrorId);
    }
}
