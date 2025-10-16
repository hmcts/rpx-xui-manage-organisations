import { Component, EventEmitter, Input, Output } from '@angular/core';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-jui-form-elements',
  templateUrl: './jui-form-elements.component.html',
  standalone: false
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

  public trackByCheckboxSubgroup(index: number, subgroup: any): string | number {
    return buildIdOrIndexKey(index, subgroup, 'id', 'name', 'fieldId', 'controlId');
  }
}
