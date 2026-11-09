import { ElementRef } from '@angular/core';
import { CaseListAccessibleNamesDirective } from './case-list-accessible-names.directive';

describe('CaseListAccessibleNamesDirective', () => {
  let host: HTMLElement;
  let directive: CaseListAccessibleNamesDirective;

  beforeEach(() => {
    host = document.createElement('div');
    host.innerHTML = `
      <input class="govuk-checkboxes__input" id="select-all">
      <input class="govuk-checkboxes__input" id="select-1234567890123456" aria-label="Old name">
      <input class="govuk-checkboxes__input" id="other-checkbox">`;
    directive = new CaseListAccessibleNamesDirective(new ElementRef(host));
  });

  afterEach(() => directive.ngOnDestroy());

  it('names the select all and individual case checkboxes and observes added checkboxes', async () => {
    directive.ngAfterViewInit();
    const checkboxes = host.querySelectorAll('input');
    expect(checkboxes[0].getAttribute('aria-label')).toBe('Select all cases on this page');
    expect(checkboxes[1].getAttribute('aria-label')).toBe('Select case 1234567890123456');
    expect(checkboxes[2].hasAttribute('aria-label')).toBeFalse();

    const added = document.createElement('input');
    added.className = 'govuk-checkboxes__input';
    added.id = 'select-42';
    host.appendChild(added);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(added.getAttribute('aria-label')).toBe('Select case 42');
  });
});
