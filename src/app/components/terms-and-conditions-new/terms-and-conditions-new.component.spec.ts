import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TermsConditionsService } from '../../../shared/services/termsConditions.service';
import { TermsAndConditionsNewComponent } from './terms-and-conditions-new.component';

const storeMock = {
  pipe: () => of(null),
  dispatch: () => {}
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let pipeSpy: jasmine.Spy;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let dispatchSpy: jasmine.Spy;

describe('TermsAndConditionsNewComponent', () => {
  let component: TermsAndConditionsNewComponent;
  let fixture: ComponentFixture<TermsAndConditionsNewComponent>;

  beforeEach(waitForAsync(() => {
    pipeSpy = spyOn(storeMock, 'pipe');
    dispatchSpy = spyOn(storeMock, 'dispatch');
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [TermsAndConditionsNewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: storeMock
        },
        TermsConditionsService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsNewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
