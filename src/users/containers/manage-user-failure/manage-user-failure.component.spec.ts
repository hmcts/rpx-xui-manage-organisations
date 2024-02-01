import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserFailureComponent } from './manage-user-failure.component';

describe('ManageUserFailureComponent', () => {
  let component: ManageUserFailureComponent;
  let fixture: ComponentFixture<ManageUserFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageUserFailureComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageUserFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct link when passed a valid userId', () => {
    const userId = '123';
    const expectedLink = `/users/user/${userId}`;

    expect(component.getEditUserPermissionsLink(userId)).toEqual(expectedLink);
  });
});
