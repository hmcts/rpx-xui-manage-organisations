import {Component, Input} from '@angular/core';

/*
* Gov UK Label component
* Responsible for displaying label tag
* @prop isPageHading - boolean to display h1
* @prop config - obj with properties
* */
@Component({
    selector: 'lib-gov-label',
    template: `@if (config.isPageHeading) {
  <h1>
    @if (config.label) {
      <label [class]="config.classes + ' govuk-label'" [for]="config.id">
        @if (config.hiddenLabelContext) {
          <span class="govuk-visually-hidden">{{config.hiddenLabelContext}}</span>
        }
        {{config.label}}
      </label>
    }
  </h1>
} @else {
  @if (config.label) {
    <label [class]="config.classes + ' govuk-label'" [for]="config.id">
      @if (config.hiddenLabelContext) {
        <span class="govuk-visually-hidden">{{config.hiddenLabelContext}}</span>
      }
      {{config.label}}
    </label>
  }
}
`,
    standalone: false
})
export class GovUkLabelComponent {
  constructor () {}
  @Input() config: {
    label: string;
    name: string;
    id: string;
    isPageHeading;
    classes: string;
    hiddenLabelContext: string
  };

}
