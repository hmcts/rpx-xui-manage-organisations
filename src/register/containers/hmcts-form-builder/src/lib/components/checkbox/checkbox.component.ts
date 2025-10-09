import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    standalone: false
})
export class CheckboxComponent {
    @Input() group: FormGroup;
    @Input() idPrefix;
    @Input() name;
    @Input() items;
    @Input() classes;
    @Input() labelClasses;
    @Input() validate;
}
