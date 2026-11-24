import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';

@Component({
  selector: 'app-fieldset',
  templateUrl: './fieldset.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class FieldsetComponent {
    @Input() classes;
    @Input() validate;
    @Input() group;
    @Input() data: Array<any>;

    public trackByFieldsetItem(index: number, item: any): string | number {
      return buildIdOrIndexKey(index, item as any, 'id', 'legend');
    }
}
