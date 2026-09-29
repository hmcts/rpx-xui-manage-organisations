import { Component } from '@angular/core';
import sitemapSections from './sitemap-links.json';

export interface SitemapLink {
  text: string;
  href: string;
}

export interface SitemapSection {
  heading: string;
  links: SitemapLink[];
}

export const SITEMAP_SECTIONS: SitemapSection[] = sitemapSections;

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  standalone: false
})
export class SitemapComponent {
  public readonly sections = SITEMAP_SECTIONS;
}
