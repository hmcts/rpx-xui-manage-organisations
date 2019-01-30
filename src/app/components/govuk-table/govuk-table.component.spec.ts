import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTableComponent } from './govuk-table.component';
import { RouterModule } from '@angular/router';

describe('GovukTableComponent', () => {
  let component: GovukTableComponent;
  let fixture: ComponentFixture<GovukTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovukTableComponent ],
      imports: [
        RouterModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovukTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
