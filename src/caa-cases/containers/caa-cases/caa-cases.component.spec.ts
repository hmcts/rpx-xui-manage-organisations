import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { CaaCasesComponent } from './caa-cases.component';

fdescribe('CaaCasesComponent', () => {
  let component: CaaCasesComponent;
  let store: any;
  let organisationStore: any;
  let router: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        RouterTestingModule
      ]
    });
    store = TestBed.get(Store);
    organisationStore = TestBed.get(Store);
    spyOn(store, 'pipe').and.callThrough();
    spyOn(store, 'dispatch').and.callThrough();
    // spyOn(organisationStore, 'pipe').and.callThrough();
    // spyOn(organisationStore, 'dispatch').and.callThrough();
  });

  it('is truthy', () => {
    expect(component).toBeTruthy();
  });
});
