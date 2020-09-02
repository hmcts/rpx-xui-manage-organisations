import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {Action, combineReducers, select, Store, StoreModule} from '@ngrx/store';
import { of } from 'rxjs';
import { OrganisationComponent } from './organisation.component';
import * as fromStore from '../../../users/store';
import * as fromRoot from '../../../app/store';
import {Organisation} from '../../organisation.model';

const storeMock = {
  pipe: () => {},
  dispatch: (action: Action) => {}
};
let pipeSpy: jasmine.Spy;
let dispatchSpy: jasmine.Spy;

describe('OrganisationComponent', () => {

  let component: OrganisationComponent;
  let fixture: ComponentFixture<OrganisationComponent>;
  let store: Store<fromStore.UserState>;

  beforeEach(() => {
    pipeSpy = spyOn(storeMock, 'pipe').and.returnValue({
      subscribe: () => {},
    });
    dispatchSpy = spyOn(storeMock, 'dispatch');

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          feature: combineReducers(fromStore.reducers),
        }),
      ],
      declarations: [ OrganisationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: storeMock,
        },
        OrganisationComponent
      ]
    }).compileComponents();

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(OrganisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Organisation needs to be mocked, and then placed through
  // int
  it('should get the organisation details.', () => {
    expect(component.getOrganisationDetails()).toBeTruthy();
  });

  // and orgData should be populated
  it('should make a call to select getOrganisationSel.', () => {

    // const testOrganisation: Partial<Organisation> = {};
    component.getOrganisation();
    expect(store.pipe).toHaveBeenCalled();
    // expect(component.getOrganisationData()).toEqual({});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
