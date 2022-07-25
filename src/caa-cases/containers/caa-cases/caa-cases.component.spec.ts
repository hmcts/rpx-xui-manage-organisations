import { CaaCasesComponent } from './caa-cases.component';

describe('CaaCasesComponent', () => {
  let component: CaaCasesComponent;
  let store: any;
  let organisationStore: any;
  beforeEach(() => {
    store = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    organisationStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    component = new CaaCasesComponent(store, organisationStore);
  });

  it('is truthy', () => {
    expect(component).toBeTruthy();
  });
});
