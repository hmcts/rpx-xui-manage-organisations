import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-hidden-input',
  templateUrl: './hidden-input.component.html'
})
export class HiddenInputComponent implements OnInit{
  @Input() public group: UntypedFormGroup;
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
