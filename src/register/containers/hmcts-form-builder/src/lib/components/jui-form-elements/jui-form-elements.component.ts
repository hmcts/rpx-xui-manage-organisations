import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-jui-form-elements',
  templateUrl: './jui-form-elements.component.html'
})
export class JuiFormElementsComponent {
    @Input() group: FormGroup;
    @Input() data;
    @Input() validate;
    @Output() btnClick =  new EventEmitter();

    public onBtnClick(event) {
      this.btnClick.emit(event);
    }
}
