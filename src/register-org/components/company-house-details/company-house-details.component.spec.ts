import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHouseDetailsComponent } from './company-house-details.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CompanyHouseDetailsComponent', () => {
  let component: CompanyHouseDetailsComponent;
  let fixture: ComponentFixture<CompanyHouseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyHouseDetailsComponent],
      imports: [RouterTestingModule]
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
