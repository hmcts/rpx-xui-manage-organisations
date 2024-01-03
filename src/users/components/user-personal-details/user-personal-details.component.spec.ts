import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPersonalDetailsComponent } from './user-personal-details.component';

describe('UserPersonalDetailsComponent', () => {
  let component: UserPersonalDetailsComponent;
  let fixture: ComponentFixture<UserPersonalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPersonalDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
