import { AfterViewInit, Component } from '@angular/core';
import { Accordion, isSupported } from 'govuk-frontend';

@Component({
  selector: 'app-solicitor-profile-content',
  templateUrl: './solicitor-profile-content.component.html',
  styleUrls: ['./solicitor-profile-content.component.scss'],
  standalone: false
})
export class SolicitorProfileContentComponent implements AfterViewInit {
  private readonly accordianConfig = {
    i18n: {
      showSection: 'Read more',
      hideSection: 'Read less'
    }
  };

  ngAfterViewInit(): void {
    if (!isSupported()) {
      return;
    }

    const accordion1 = document.getElementById('solicitor-profile-accordion');
    if (accordion1) {
      new Accordion(accordion1, this.accordianConfig).init();
    }

    const accordion2 = document.getElementById('additional-access-accordion');
    if (accordion2) {
      new Accordion(accordion2, this.accordianConfig).init();
    }
  }
}
