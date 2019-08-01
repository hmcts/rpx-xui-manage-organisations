import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '../../services/form-builder-validation.service';

@Component({
    selector: 'app-validation-header',
    templateUrl: './validation-header.component.html'
})
/**
 * ValidationHeaderComponent
 *
 * If the control that this error message component links to is not valid we
 * show the Error Message, sent through from the parent component.
 */
export class ValidationHeaderComponent {
    @Input() formGroup: FormGroup;
    @Input() controlId;

    // TODO : deprecate as not needed?
    @Input() idPrefix = 'ta';
    @Input() name = 'ta';

    // TODO : Move to constants file.
    FORM_CONTROL = 'formControl';
    FORM_GROUP = 'formGroup';

    /**
     * Signature for validationHeaderControls to be used in a Unit Test is:
     *
     * [{
     *  value: 'Enter what information is needed',
     *  controlId: 'informationNeeded',
     *  pageLink: '#linkToTextArea'
     * },
     * {
     *  value: 'Select yes if you want to include an annotated version of the draft consent order',
     *  controlId: 'includeAnnotatedVersionDraftConsOrder',
     *  pageLink: '#linkToRadiobuttons'
     *}];
     */
    @Input() validationHeaderErrorMessages;

    constructor(private validationService: ValidationService) {
    }

    /**
     * Checks if this control is valid.
     *
     * // @see ValidationService
     * // @param control - 'informationNeeded'
     */
    isFormControlValid(formGroup: FormGroup, control: string): boolean {

        return this.validationService.isFormControlValid(formGroup, control);
    }

    /**
     * isFormGroupInvalid
     *
     * // @param formGroup
     * // @param validationErrorId
     * // @return {boolean}
     */
    isFormGroupInvalid(formGroup: FormGroup, validationErrorId: string): boolean {

        return this.validationService.isFormGroupInvalid(formGroup, validationErrorId);
    }

    /**
     * Checks if we should show a validation message for a form control, or the
     * form group.
     *
     * // @param {string} validationLevel - validation level can either be formGroup or formControl.
     * A formGroup level is validation that handles multiply form controls, when validating multiply components
     * at the same time, ie. when you wish to see if a checkbox is checked, from multiply checkboxes, you must
     * check this on a common ancestor of a set of controls. This common ancestor is always the Angular FormGroup.
     * formControl level is validation that handles a single form control.
     *
     * This abstration was based on how Angular 6's FormGroup and FormControl are abstract from each other,
     * after reading.
     *
     * // @param controlId
     * // @return {boolean}
     */
    isValidationLevel(validationLevel: string, level: string): boolean {
        return validationLevel === level;
    }
    scrollToElement(id): boolean {
        const el = document.getElementById(id);
        el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
        return false;
    }
}
