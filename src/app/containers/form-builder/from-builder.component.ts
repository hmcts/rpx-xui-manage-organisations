import {Component, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html'
})

export class FromBuilderComponent implements OnInit {
  constructor() {}
  @Input() formDraft: FormGroup;

  ngOnInit(): void {
  }
}
