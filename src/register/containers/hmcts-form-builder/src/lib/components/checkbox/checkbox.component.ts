import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html'
})
export class CheckboxComponent {
    @Input() group: UntypedFormGroup;
    @Input() idPrefix;
    @Input() name;
    @Input() items;
    @Input() classes;
    @Input() labelClasses;
    @Input() validate;
}
