import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-radiobutton',
  templateUrl: './radiobutton.component.html'
})
export class RadiobuttonComponent {
    @Input() group: FormGroup;
    @Input() idPrefix = 'rb';
    @Input() name = 'rb';
    @Input() items;
    @Input() classes;
    @Input() control;
    @Input() validate;
    @Input() showValidation;
    @Input() validationError;

    constructor() { }

}
