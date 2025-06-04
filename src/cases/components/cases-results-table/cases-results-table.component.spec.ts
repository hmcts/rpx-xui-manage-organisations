import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesResultsTableComponent } from './cases-results-table.component';
import { provideMockStore } from '@ngrx/store/testing';
import { CaaCasesService } from 'src/cases/services';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

xdescribe('CasesCasesResultsTableComponent', () => {
  let component: CasesResultsTableComponent;
  let fixture: ComponentFixture<CasesResultsTableComponent>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;

  beforeEach(async () => {
    caaCasesService = jasmine.createSpyObj<CaaCasesService>(
      'caaCasesService',
      [
        'getCaaCases',
        'getCaaCaseTypes',
        'storeSessionState',
        'retrieveSessionState',
        'removeSessionState'
      ]
    );
    await TestBed.configureTestingModule({
      declarations: [ CasesResultsTableComponent ],
      providers: [provideMockStore(),
        { provide: CaaCasesService, useValue: caaCasesService }
      ],
      imports: [
        MatAutocompleteModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CasesResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
