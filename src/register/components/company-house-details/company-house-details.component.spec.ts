import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHouseDetailsComponent } from './company-house-details.component';

describe('CompanyHouseDetailsComponent', () => {
  let component: CompanyHouseDetailsComponent;
  let fixture: ComponentFixture<CompanyHouseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyHouseDetailsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyHouseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
