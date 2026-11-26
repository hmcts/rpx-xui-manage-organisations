import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
