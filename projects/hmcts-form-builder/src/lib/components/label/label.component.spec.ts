import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelComponent } from './label.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('LabelComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('Predifined data: idPrefix', () => {
        expect(component.idPrefix).toEqual('lb');
        expect(component.name).toEqual('lb');
    });
});
