import { Component, Input } from '@angular/core';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';

@Component({
  selector: 'app-fieldset',
  templateUrl: './fieldset.component.html',
  standalone: false
})
export class FieldsetComponent {
    @Input() classes;
    @Input() isPageHeading = false;
    @Input() validate;
    @Input() group;
    @Input() data: Array<any>;

    public get legendItem(): any {
      return this.data?.find((item) => item.legend);
    }

    public trackByFieldsetItem(index: number, item: any): string | number {
      return buildIdOrIndexKey(index, item as any, 'id', 'legend');
    }
}
