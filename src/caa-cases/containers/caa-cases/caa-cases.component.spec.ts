import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TableConfig } from '@hmcts/ccd-case-ui-toolkit';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import * as fromOrganisationStore from '../../../organisation/store';
import { CaaCasesFilterType, CaaCasesNoDataMessage, CaaCasesPageTitle, CaaCasesPageType, CaaShowHideFilterButtonText } from '../../models/caa-cases.enum';
import * as fromStore from '../../store';
import { CaaCasesComponent } from './caa-cases.component';

// TODO: More tests will be added when progressing through the CAA epic
describe('CaaCasesComponent', () => {
  let component: CaaCasesComponent;
  let fixture: ComponentFixture<CaaCasesComponent>;
  let store: Store<fromStore.CaaCasesState>;
  let organisationStore: Store<fromOrganisationStore.OrganisationState>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        RouterTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CaaCasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    organisationStore = TestBed.get(Store);
    fixture = TestBed.createComponent(CaaCasesComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('is truthy', () => {
    expect(component).toBeTruthy();
  });

  it('should set current page type', () => {
    const routerUrlPropertySpy = spyOnProperty(router, 'url', 'get').and.returnValue('/unassigned-cases');
    component.setCurrentPageType();
    expect(component.caaCasesPageType).toEqual(CaaCasesPageType.UnassignedCases);
    routerUrlPropertySpy.and.returnValue('/assigned-cases');
    component.setCurrentPageType();
    expect(component.caaCasesPageType).toEqual(CaaCasesPageType.AssignedCases);
  });

  it('should set current page title', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.setCurrentPageTitle();
    expect(component.pageTitle).toEqual(CaaCasesPageTitle.UnassignedCases);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.setCurrentPageTitle();
    expect(component.pageTitle).toEqual(CaaCasesPageTitle.AssignedCases);
  });

  it('should set show hide filter button text', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.setShowHideFilterButtonText();
    expect(component.caaShowHideFilterButtonText).toEqual(CaaShowHideFilterButtonText.UnassignedCasesShow);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.setShowHideFilterButtonText();
    expect(component.caaShowHideFilterButtonText).toEqual(CaaShowHideFilterButtonText.AssignedCasesShow);
  });

  it('should set selected filter type and value', () => {
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.setSelectedFilterTypeAndValue();
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.None);
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.setSelectedFilterTypeAndValue();
    expect(component.selectedFilterType).toEqual(CaaCasesFilterType.AllAssignees);
    expect(component.selectedFilterValue).toBeNull();
  });

  it('should load cases and set table config', () => {
    spyOn(component, 'setTableConfig');
    const storePipeMock = spyOn(store, 'pipe');
    const storeSelectMock = spyOn(store, 'select');
    storePipeMock.and.returnValue(of({}));
    storeSelectMock.and.returnValue(of({}));
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    component.loadCasesAndSetTableConfig();
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    component.loadCasesAndSetTableConfig();
    expect(component.setTableConfig).toHaveBeenCalledTimes(2);
  });

  it('should set table config', () => {
    let config = null;
    component.setTableConfig(config);
    expect(component.tableConfig).toBeUndefined();
    config = new TableConfig();
    component.setTableConfig(config);
    expect(component.tableConfig).not.toBeNull();
  });

  it('should return correct no cases found message', () => {
    let cases = [];
    component.totalCases = 0;
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    expect(component.getNoCasesFoundMessage(cases)).toEqual(CaaCasesNoDataMessage.NoAssignedCases);
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    expect(component.getNoCasesFoundMessage(cases)).toEqual(CaaCasesNoDataMessage.NoUnassignedCases);
    component.totalCases = 1;
    component.caaCasesPageType = CaaCasesPageType.AssignedCases;
    expect(component.getNoCasesFoundMessage(cases)).toEqual(CaaCasesNoDataMessage.AssignedCasesFilterMessage);
    component.caaCasesPageType = CaaCasesPageType.UnassignedCases;
    expect(component.getNoCasesFoundMessage(cases)).toEqual(CaaCasesNoDataMessage.UnassignedCasesFilterMessage);
    cases = null;
    expect(component.getNoCasesFoundMessage(cases)).toEqual('');
  });

  // TODO: Need to revisit this test, as it doesn't seem possible to spy on the ngrx select operator directly
  xit('should load the correct data from the store', () => {
    // The fake url needs to be set before the component constructor is called
    const routerUrlPropertySpy = spyOnProperty(router, 'url', 'get').and.returnValue('/unassigned-cases');
    fixture = TestBed.createComponent(CaaCasesComponent);
    component = fixture.componentInstance;
    // expect(ngrxStore.select).toHaveBeenCalledWith(fromStore.getAllUnassignedCases);
    routerUrlPropertySpy.and.returnValue('/assigned-cases');
    fixture = TestBed.createComponent(CaaCasesComponent);
    component = fixture.componentInstance;
    // expect(ngrxStore.select).toHaveBeenCalledWith(fromStore.getAllAssignedCases);
  });
});
