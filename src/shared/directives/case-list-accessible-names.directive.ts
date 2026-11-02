import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
  selector: 'ccd-case-list[appCaseListAccessibleNames]',
  standalone: false
})
export class CaseListAccessibleNamesDirective implements AfterViewInit, OnDestroy {
  private observer?: MutationObserver;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  public ngAfterViewInit(): void {
    this.updateCheckboxNames();

    if (typeof MutationObserver === 'undefined') {
      return;
    }

    this.observer = new MutationObserver(() => this.updateCheckboxNames());
    this.observer.observe(this.elementRef.nativeElement, { childList: true, subtree: true });
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private updateCheckboxNames(): void {
    const checkboxes = this.elementRef.nativeElement.querySelectorAll<HTMLInputElement>(
      'input.govuk-checkboxes__input[id^="select-"]'
    );

    checkboxes.forEach((checkbox) => {
      const name = checkbox.id === 'select-all'
        ? 'Select all cases on this page'
        : `Select case ${checkbox.id.slice('select-'.length)}`;

      if (checkbox.getAttribute('aria-label') !== name) {
        checkbox.setAttribute('aria-label', name);
      }
    });
  }
}
