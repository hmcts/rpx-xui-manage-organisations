import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-radiobutton',
  templateUrl: './radiobutton.component.html'
})
export class RadiobuttonComponent {
    @Input() public group: FormGroup;
    @Input() public idPrefix = 'rb';
    @Input() public name = 'rb';
    @Input() public items;
    @Input() public classes;
    @Input() public control;
    @Input() public validate;
    @Input() public showValidation;
    @Input() public validationError;

    constructor() { }

}
