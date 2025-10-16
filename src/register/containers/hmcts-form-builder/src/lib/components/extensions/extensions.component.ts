import { Component, Input } from '@angular/core';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.component.html',
  standalone: false
})
export class ExtensionsComponent {
  @Input() title;
  @Input() text;
  @Input() ul;

  public trackByExtensionItem(index: number, item: any): string | number {
    return buildIdOrIndexKey(index, { value: item } as any, 'value');
  }
}
