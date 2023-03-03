import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-jui-form-elements',
  templateUrl: './jui-form-elements.component.html'
})
export class JuiFormElementsComponent {
  @Input() public group: FormGroup;
  @Input() public data;
  @Input() public validate;
  @Output() public btnClick = new EventEmitter();
  @Output() public blurCast = new EventEmitter();

  public onBtnClick(event) {
    this.btnClick.emit(event);
  }

  public onBlur(event) {
    this.blurCast.emit(event);
  }
}
