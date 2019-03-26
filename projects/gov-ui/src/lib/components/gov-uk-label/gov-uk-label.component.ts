import {Component, Input} from '@angular/core';

/*
* Gov UK Label component
* Responsible for displaying label tag
* @prop isPageHading - boolean to display h1
* @prop config - obj with properties
* */
@Component({
  selector: 'lib-gov-label',
  template: `<h1 *ngIf="config.isPageHeading else noHeading">
          <label *ngIf="config.label" [class]="config.classes + ' govuk-label'"
                 [for]="config.id" [innerHTML]="config.label">
          </label>
        </h1>
        <ng-template #noHeading>
          <label *ngIf="config.label" [class]="config.classes + ' govuk-label'"
                 [for]="config.id" [innerHTML]="config.label">
          </label>
        </ng-template>
  `
})
export class GovUkLabelComponent {
  constructor () { }
  @Input() config: { label: string, name: string; id: string, isPageHeading, classes: string };

}
