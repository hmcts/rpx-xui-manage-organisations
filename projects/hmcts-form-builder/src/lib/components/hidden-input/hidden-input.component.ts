import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '../../services/form-builder-validation.service';

@Component({
  selector: 'app-hidden-input',
  templateUrl: './hidden-input.component.html'
})
export class HiddenInputComponent implements OnInit{
    @Input() group: FormGroup;
    @Input() item: {
      control: string;
      classes: Array<string>
    };
    @Input() value;
    componentClasses: string;
    constructor() {
    }
    ngOnInit(): void {
      this.componentClasses = 'govuk-input' + this.item.classes;
    }
}
