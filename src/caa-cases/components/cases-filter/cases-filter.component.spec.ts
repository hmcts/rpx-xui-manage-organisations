import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesFilterComponent } from './cases-filter.component';

describe('CasesFilterComponent', () => {
  let component: CasesFilterComponent;
  let fixture: ComponentFixture<CasesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasesFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
