import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageUserFailureComponent } from './manage-user-failure.component';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('ManageUserFailureComponent', () => {
  let component: ManageUserFailureComponent;
  let fixture: ComponentFixture<ManageUserFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ userId: '123' })) }
        }
      ],
      imports: [RouterTestingModule],
      declarations: [ManageUserFailureComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageUserFailureComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set editUserUrl to the correct value when passed a valid userID via route params', () => {
    const userId = '123';
    const expectedLink = `/users/user/${userId}`;

    expect(component.editUserUrl).toEqual(expectedLink);
  });
});
