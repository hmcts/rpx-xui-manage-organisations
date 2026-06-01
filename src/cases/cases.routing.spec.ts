import { casesRouting, ROUTES } from './cases.routing';

describe('Cases routing', () => {
  it('should expose the expected case routes', () => {
    expect(ROUTES.map((route) => route.path)).toEqual([
      '',
      'case-share',
      'case-share-confirm/:pageType',
      'case-share-complete/:pageType',
      'accept-cases'
    ]);
  });

  it('should protect every route with the same guard set', () => {
    ROUTES.forEach((route) => {
      expect(route.canActivate?.length).toBe(3);
    });
  });

  it('should export a child router module definition', () => {
    expect(casesRouting).toBeTruthy();
  });
});
