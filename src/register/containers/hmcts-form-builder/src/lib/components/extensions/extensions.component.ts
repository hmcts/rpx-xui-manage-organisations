import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-extensions',
  templateUrl: './extensions.component.html'
})
export class ExtensionsComponent {
  @Input() public title;
  @Input() public text;
  @Input() public ul;
}
