import { Component } from '@angular/core';

export interface SitemapLink {
  text: string;
  href: string;
}

export interface SitemapSection {
  heading: string;
  links: SitemapLink[];
}

function createLinks(entries: [text: string, href: string][]): SitemapLink[] {
  return entries.map(([text, href]) => ({ text, href }));
}

export const SITEMAP_SECTIONS: SitemapSection[] = [
  {
    heading: 'Manage your organisation',
    links: createLinks([
      ['Organisation', '/organisation'],
      ['Update PBA numbers', '/organisation/update-pba-numbers'],
      ['Users', '/users'],
      ['Invite a user', '/users/invite-user'],
      ['Manage a user', '/users/manage'],
      ['Fee accounts', '/fee-accounts'],
      ['Cases', '/cases'],
      ['Unassigned cases', '/unassigned-cases'],
      ['Assigned cases', '/assigned-cases']
    ])
  },
  {
    heading: 'Register an organisation',
    links: createLinks([
      ['Before you start', '/register-org-new/register'],
      ['Organisation name and Companies House number', '/register-org-new/company-house-details'],
      ['Organisation type', '/register-org-new/organisation-type'],
      ['Regulatory organisation', '/register-org-new/regulatory-organisation-type'],
      ['Document exchange reference', '/register-org-new/document-exchange-reference'],
      ['Document exchange details', '/register-org-new/document-exchange-reference-details'],
      ['Services access', '/register-org-new/organisation-services-access'],
      ['Payment by account', '/register-org-new/payment-by-account'],
      ['Payment by account details', '/register-org-new/payment-by-account-details'],
      ['Registered address', '/register-org-new/registered-address/external'],
      ['Individual registered with a regulator', '/register-org-new/individual-registered-with-regulator'],
      ['Individual regulator details', '/register-org-new/individual-registered-with-regulator-details'],
      ['Contact details', '/register-org-new/contact-details'],
      ['Check your answers', '/register-org-new/check-your-answers'],
      ['Registration submitted', '/register-org-new/registration-submitted']
    ])
  },
  {
    heading: 'Help and legal information',
    links: createLinks([
      ['Accessibility statement', '/accessibility'],
      ['Cookies', '/cookies'],
      ['Privacy policy', '/privacy-policy'],
      ['Terms and conditions', '/terms-and-conditions'],
      ['Terms and conditions for registering another organisation', '/terms-and-conditions-register-other-org'],
      ['Get help', '/get-help'],
      ['Site map', '/sitemap']
    ])
  }
];

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  standalone: false
})
export class SitemapComponent {
  public readonly sections = SITEMAP_SECTIONS;
}
