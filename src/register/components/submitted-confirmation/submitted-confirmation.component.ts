import {Component} from '@angular/core';
/**
 * Stateless component responsible for
 * displaying confirmation after form submit.
 */

@Component({
  selector: 'app-submitted-confirmation',
  template: `
    <div class="govuk-panel govuk-panel--confirmation">
      <h1 class="govuk-panel__title">
        Registration details submitted
      </h1>
    </div>
    <h2 class="govuk-heading-m">What happens next</h2>
    <p class="govuk-body">
      We’ll approve the registration within 3 working days.
    </p>
    <p class="govuk-body">
      You'll get an email from HM Courts and Tribunals Registrations asking you to finish creating your account.
    </p>
  `
})
export class SubmittedConfirmationComponent {

  constructor() {}

}
