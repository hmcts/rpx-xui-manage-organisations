import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgdProfileContentComponent } from './ogd-profile-content.component';

describe('OgdProfileContentComponent', () => {
  let component: OgdProfileContentComponent;
  let fixture: ComponentFixture<OgdProfileContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OgdProfileContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OgdProfileContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
