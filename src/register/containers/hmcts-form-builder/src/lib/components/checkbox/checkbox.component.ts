import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html'
})
export class CheckboxComponent {
    @Input() public group: FormGroup;
    @Input() public idPrefix;
    @Input() public name;
    @Input() public items;
    @Input() public classes;
    @Input() public labelClasses;
    @Input() public validate;

    constructor() {
    }

}
