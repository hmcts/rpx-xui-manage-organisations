import { AfterViewInit, Component } from '@angular/core';
import { Accordion } from 'govuk-frontend';

@Component({
  selector: 'app-solicitor-profile-content',
  templateUrl: './solicitor-profile-content.component.html',
  styleUrls: ['./solicitor-profile-content.component.scss']
})
export class SolicitorProfileContentComponent implements AfterViewInit {
  private accordianConfig = {
    i18n: {
      showSection: 'Read more',
      hideSection: 'Read less'
    }
  };

  ngAfterViewInit(): void {
    const accordion1 = document.getElementById('solicitor-profile-accordion');
    new Accordion(accordion1, this.accordianConfig).init();

    const accordion2 = document.getElementById('additional-access-accordion');
    new Accordion(accordion2, this.accordianConfig).init();
  }
}
