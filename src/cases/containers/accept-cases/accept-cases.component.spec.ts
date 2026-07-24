import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { CaaCasesPageType } from '../../models/caa-cases.enum';
import { AcceptCasesComponent } from './accept-cases.component';

describe('AcceptCasesComponent', () => {
  let component: AcceptCasesComponent;
  let router: jasmine.SpyObj<Router>;
  let store: jasmine.SpyObj<Store<any>>;
  let route: any;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    store = jasmine.createSpyObj<Store<any>>('Store', ['dispatch', 'pipe']);
    store.pipe.and.returnValue(of(null));
    route = {
      snapshot: {
        queryParams: {
          caseTypeId: 'Asylum'
        }
      }
    };
    sessionStorage.removeItem('newCases');
    component = new AcceptCasesComponent(store, route as ActivatedRoute, new FormBuilder(), router);
  });

  afterEach(() => {
    sessionStorage.removeItem('newCases');
  });

  it('should initialise from route query params', () => {
    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalled();
    expect(component.caseType).toEqual('Asylum');
    expect(component.pageTitle).toEqual('Accept Asylum cases');
    expect(component.permissionsForm.value.assignmentType).toEqual('notAssigning');
  });

  it('should initialise from stored new cases session state', () => {
    sessionStorage.setItem('newCases', JSON.stringify({ caseTypeId: 'Civil' }));

    component.ngOnInit();

    expect(component.caseType).toEqual('Civil');
    expect(component.pageTitle).toEqual('Accept Civil cases');
  });

  it('should navigate to case share when assigning cases', () => {
    component.ngOnInit();
    component.permissionsForm.patchValue({ assignmentType: 'assigning' });

    component.continue();

    expect(JSON.parse(sessionStorage.getItem('newCases'))).toEqual({
      caseTypeId: 'Asylum',
      caaPageType: CaaCasesPageType.NewCases,
      assignCases: 'assigning'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/cases/case-share'], {
      queryParams: { init: true, pageType: 'unassigned-cases', caseAccept: true }
    });
  });

  it('should navigate to confirmation when not assigning cases', () => {
    component.ngOnInit();

    component.continue();

    expect(JSON.parse(sessionStorage.getItem('newCases')).assignCases).toEqual('notAssigning');
    expect(router.navigate).toHaveBeenCalledWith(['/cases/case-share-confirm/new-cases'], {
      queryParams: { caseAccept: true, pageType: CaaCasesPageType.NewCases }
    });
  });

  it('should navigate back to cases', () => {
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/cases']);
  });
});
