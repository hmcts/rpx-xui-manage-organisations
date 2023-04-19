import { Component } from '@angular/core';

@Component({
  selector: 'app-hmcts-warning-icon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="hmcts-banner__icon" fill="currentColor"
      role="presentation" focusable="false" viewBox="0 0 25 25" height="25" width="25">
      <path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z" />
    </svg>
  `
})
export class WarningIconComponent {}
