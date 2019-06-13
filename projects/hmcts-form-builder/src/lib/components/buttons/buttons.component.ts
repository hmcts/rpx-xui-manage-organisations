import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html'
})
export class ButtonsComponent implements OnInit {
    @Input() idPrefix = 'btn';
    @Input() name = 'btn';
    @Input() group: FormGroup;
    @Input() classes;
    @Input() typeBtn;
    @Input() control;
    @Input() value;

    constructor() {
    }
    isValid: boolean;
    ngOnInit(): void {

      this.isValid = this.group.status === 'INVALID';
      this.group.valueChanges.subscribe(value => {
        this.isValid = this.group.status === 'INVALID';
      });

    }
}
