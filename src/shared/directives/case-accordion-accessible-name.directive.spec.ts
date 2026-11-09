import { ElementRef } from '@angular/core';
import { CaseAccordionAccessibleNameDirective } from './case-accordion-accessible-name.directive';

describe('CaseAccordionAccessibleNameDirective', () => {
  let host: HTMLElement;
  let directive: CaseAccordionAccessibleNameDirective;

  beforeEach(() => {
    host = document.createElement('div');
    host.innerHTML = `
      <div class="govuk-accordion__section">
        <button class="govuk-accordion__section-button"></button>
        <span class="govuk-case-sub-title">  1234567890123456  </span>
      </div>
      <div class="govuk-accordion__section">
        <button class="govuk-accordion__section-button" aria-label="Existing name"></button>
      </div>`;
    directive = new CaseAccordionAccessibleNameDirective(new ElementRef(host));
  });

  afterEach(() => directive.ngOnDestroy());

  it('sets an accessible name using the case id and observes later changes', async () => {
    directive.ngAfterViewInit();
    const button = host.querySelector('button')!;
    expect(button.getAttribute('aria-label')).toBe('Case 1234567890123456 details');

    host.querySelector('.govuk-case-sub-title')!.textContent = '654321';
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(button.getAttribute('aria-label')).toBe('Case 654321 details');
  });

  it('leaves sections without a case id unchanged', () => {
    directive.ngAfterViewInit();
    const buttons = host.querySelectorAll('button');
    expect(buttons[1].getAttribute('aria-label')).toBe('Existing name');
  });
});
