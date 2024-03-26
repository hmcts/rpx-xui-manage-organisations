import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesResultsTableComponent } from './cases-results-table.component';

describe('CasesResultsTableComponent', () => {
  let component: CasesResultsTableComponent;
  let fixture: ComponentFixture<CasesResultsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasesResultsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasesResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
