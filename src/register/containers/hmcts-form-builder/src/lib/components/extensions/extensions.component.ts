import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.component.html',
  standalone: false
})
export class ExtensionsComponent {
  @Input() title;
  @Input() text;
  @Input() ul;
}
