import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: 'xuilib-share-case[appCaseAccordionAccessibleNames]',
  standalone: false
})
export class CaseAccordionAccessibleNameDirective implements AfterViewInit, OnDestroy {
  private observer?: MutationObserver;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.updateAccordionNames();

    if (typeof MutationObserver === 'undefined') {
      return;
    }

    this.observer = new MutationObserver(() => this.updateAccordionNames());
    this.observer.observe(this.elementRef.nativeElement, {
      attributes: true,
      attributeFilter: ['aria-label'],
      childList: true,
      subtree: true
    });
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private updateAccordionNames(): void {
    const buttons = this.elementRef.nativeElement.querySelectorAll<HTMLButtonElement>(
      '.govuk-accordion__section-button'
    );

    buttons.forEach((button) => {
      const caseId = button
        .closest('.govuk-accordion__section')
        ?.querySelector('.govuk-case-sub-title')
        ?.textContent?.trim();

      const accessibleName = caseId ? `Case ${caseId} details` : undefined;

      if (accessibleName && button.getAttribute('aria-label') !== accessibleName) {
        button.setAttribute('aria-label', accessibleName);
      }
    });
  }
}
