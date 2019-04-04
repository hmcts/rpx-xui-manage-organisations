import {Component} from '@angular/core';
/*
* Gov Uk Select Dumb Component responsible for
* dropdown input.
* */
@Component({
  selector: 'lib-gov-select',
  template: `
    <div class="govuk-form-group"> 
      <lib-gov-label [config]="{label: 'Sort By', classes: 'govuk-label--m'}"></lib-gov-label>
      <select class="govuk-select" id="sort" name="sort">
        <option value="published">Recently published</option>
        <option value="updated" selected>Recently updated</option>
        <option value="views">Most views</option>
        <option value="comments">Most comments</option>
      </select>
    </div>
  `
})
export class GovUkSelectComponent {
  constructor () { }
}
