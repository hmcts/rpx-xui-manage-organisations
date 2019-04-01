import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CheboxesModel} from '../../models/cheboxes.model';


@Component({
  selector: 'lib-gov-uk-checkboxes',
  template: `
    <ng-container [formGroup]="options.group['checkboxes']">
    <lib-gov-uk-form-group-wrapper
      [error]=""
      [config]="options.config"
      [formGroupName]="options.key">
      <div class="govuk-checkboxes">
        <lib-gov-checkbox *ngFor="let item of options.items"
          [group]="options.group['checkboxes']"
          [config]="item.config">
        </lib-gov-checkbox>
      </div>
    </lib-gov-uk-form-group-wrapper>
    </ng-container>`
})
export class CheckboxesComponent implements OnInit {

  @Input() options: CheboxesModel;

  ngOnInit(): void {
    debugger;
  }

}
