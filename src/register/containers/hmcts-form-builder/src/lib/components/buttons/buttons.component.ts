import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html'
})
export class ButtonsComponent implements OnInit {
    @Input() public idPrefix = 'btn';
    @Input() public name = 'btn';
    @Input() public group: FormGroup;
    @Input() public classes; // TODO: Add type.
    @Input() public typeBtn; // TODO: Add type.
    @Input() public control; // TODO: Add type.
    @Input() public value; // TODO: Add type.

    public isValid: boolean;

    public ngOnInit(): void {

      this.isValid = this.group.status === 'INVALID';
      this.group.valueChanges.subscribe(value => {
        this.isValid = this.group.status === 'INVALID';
      });

    }
}
