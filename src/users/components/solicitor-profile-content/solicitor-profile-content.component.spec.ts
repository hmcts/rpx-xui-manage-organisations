import { SolicitorProfileContentComponent } from './solicitor-profile-content.component';

describe('SolicitorProfileContentComponent', () => {
  let component: SolicitorProfileContentComponent;

  beforeEach(() => {
    component = new SolicitorProfileContentComponent();
    document.body.classList.remove('govuk-frontend-supported');
  });

  it('should skip accordion initialisation when GOV.UK Frontend is unsupported', () => {
    const getElementById = spyOn(document, 'getElementById');

    component.ngAfterViewInit();

    expect(getElementById).not.toHaveBeenCalled();
  });
});
