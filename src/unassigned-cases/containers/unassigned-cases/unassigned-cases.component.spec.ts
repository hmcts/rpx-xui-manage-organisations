import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import * as UnassignedCasesActions from 'src/unassigned-cases/store/actions/unassigned-cases.actions';
import * as UnassignedShareCasesActions from 'src/unassigned-cases/store/actions/share-case.action';
import { UnassignedCasesComponent } from './unassigned-cases.component';
import { By } from '@angular/platform-browser';

describe('UnassignedCasesComponent', () => {
  let component: UnassignedCasesComponent;
  let mockStore: any;
  let fixture: ComponentFixture<UnassignedCasesComponent>;

  const initialState = {
    unassignedCases: {
      unassignedCases: {
          unassignedCases: {
            idField: '1',
            columnConfigs: [{
              header: 'header test',
              key: 'key test',
              type: 'type1'
            }],
              data: ['test data']
          },
          caseTypes: [ {
            text: 'test case',
            href: 'test href',
            active: false
        }],
          selectedCases: {}
      }
    },
    caseShare: {
      shareCases: [ {
        caseId: '123456789',
        caseTitle: 'title',
        caseTypeId: 'type1',
        roles: ['role1'],
        sharedWith: [],
        pendingShares: [],
        pendingUnshares: []
      }],
      loading: false,
      error: undefined,
      users: []
    }
  };

  const matTabGroupElement = () => {
    return fixture.debugElement.queryAll(By.css('mat-tab-group'));
  };

  const ccsListElement = () => {
    return fixture.debugElement.queryAll(By.css('ccd-case-list'));
  };

  beforeEach(() => {
      mockStore = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
      const actions$ = of (
      [
        UnassignedCasesActions.LoadUnassignedCaseTypes, UnassignedShareCasesActions.AddShareCases,
        UnassignedShareCasesActions.SynchronizeStateToStore, UnassignedCasesActions.LoadUnassignedCases
      ]);

      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          RouterTestingModule,
        ],
        declarations: [UnassignedCasesComponent],
        providers: [
          provideMockStore({initialState}),
          provideMockActions(() => actions$),
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                  params: {
                      cid: '1234'
                  },
              }
            }
          }
        ]
      })
      .compileComponents();
      fixture = TestBed.createComponent(UnassignedCasesComponent);
      component = fixture.componentInstance;
      spyOn(component, 'tabChanged').and.callThrough();
      spyOn(component, 'onCaseSelection').and.callThrough();
      fixture.detectChanges();
  });

  it('should create component', () => {
      expect(component).toBeTruthy();
  });

  it('should have more than one nav item', () => {
    expect(component.navItems).toBeDefined();
    expect(component.navItems.length).toBeGreaterThan(0);
  });

  it('should create case data', () => {
    expect(matTabGroupElement().length).toBeGreaterThan(0);
    const matGroup = matTabGroupElement()[0];
    matGroup.triggerEventHandler('selectedTabChange',  { tab: { textLabel: 'test case' }});
    fixture.detectChanges();
    expect(component.tabChanged).toHaveBeenCalled();
  });

  it('should create case data', () => {
    expect(ccsListElement().length).toBeGreaterThan(0);
    const ccList = ccsListElement()[0];
    ccList.triggerEventHandler('selection',  { tab: { textLabel: 'string' }});
    fixture.detectChanges();
    expect(component.onCaseSelection).toHaveBeenCalled();
  });
});
