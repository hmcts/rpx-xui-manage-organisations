import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';

@Component({
  selector: 'app-radiobutton',
  templateUrl: './radiobutton.component.html',
  standalone: false
})
export class RadiobuttonComponent {
  @Input() group: FormGroup;
  @Input() idPrefix = 'rb';
  @Input() name = 'rb';
  @Input() items;
  @Input() classes;
  @Input() control;
  @Input() validate;
  @Input() showValidation;
  @Input() validationError;

  public trackByRadioItem(index: number, item: any): string | number {
    return buildIdOrIndexKey(index, item, 'value', 'text', 'id');
  }

  public trackByListItem(index: number, item: any): string | number {
    return buildIdOrIndexKey(index, { value: item } as any, 'value');
  }

  public trackBySubGroup(index: number, subgroup: any): string | number {
    return buildIdOrIndexKey(index, subgroup, 'id', 'legend', 'controlId');
  }
}
