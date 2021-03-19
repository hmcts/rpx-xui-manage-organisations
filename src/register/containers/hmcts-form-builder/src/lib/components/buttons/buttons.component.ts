import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html'
})
export class ButtonsComponent implements OnInit {
    @Input() public idPrefix = 'btn';
    @Input() public name = 'btn';
    @Input() public group: FormGroup;
    @Input() public classes;
    @Input() public typeBtn;
    @Input() public control;
    @Input() public value;
    @Output() public btnClick =  new EventEmitter();

    constructor() {
    }

    public isValid: boolean;
    public ngOnInit(): void {

      this.isValid = this.group.status === 'INVALID';
      this.group.valueChanges.subscribe(value => {
        this.isValid = this.group.status === 'INVALID';
      });

    }

    public onClick(event) {
      this.btnClick.emit(event.target.id);
    }
}
