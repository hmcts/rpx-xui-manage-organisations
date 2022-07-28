import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { CaaCasesComponent } from './caa-cases.component';

describe('CaaCasesComponent', () => {
  let component: CaaCasesComponent;
  let fixture: ComponentFixture<CaaCasesComponent>;
  let store: any;
  let organisationStore: any;
  let router: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        RouterTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ CaaCasesComponent ]
    })
    .compileComponents();
    store = TestBed.get(Store);
    organisationStore = TestBed.get(Store);
    spyOn(store, 'pipe').and.callThrough();
    spyOn(store, 'dispatch').and.callThrough();
    // spyOn(organisationStore, 'pipe').and.callThrough();
    // spyOn(organisationStore, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(CaaCasesComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('is truthy', () => {
    expect(component).toBeTruthy();
  });
});
