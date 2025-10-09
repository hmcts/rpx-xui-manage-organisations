import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-hidden-input',
    templateUrl: './hidden-input.component.html',
    standalone: false
})
export class HiddenInputComponent implements OnInit{
  @Input() public group: FormGroup;
  @Input() public item: {
    control: string;
    classes: Array<string>
  };

  @Input() public value; // TODO: Add type.
  public componentClasses: string;

  public ngOnInit(): void {
    this.componentClasses = 'govuk-input' + this.item.classes;
  }
}
