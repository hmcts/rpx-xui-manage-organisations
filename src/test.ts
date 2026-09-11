// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting
} from '@angular/platform-browser/testing';

// GOV.UK Frontend components only initialise in browsers marked as supported.
// The application template adds this class, but Karma does not load index.html.
document.body.classList.add('govuk-frontend-supported');

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
