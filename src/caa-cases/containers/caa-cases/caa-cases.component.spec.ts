import { CaaCasesComponent } from './caa-cases.component';

describe('CaaCasesComponent', () => {
  let component: CaaCasesComponent;
  let store: any;
  let appStore: any;
  beforeEach(() => {
    store = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    appStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    component = new CaaCasesComponent(store);
  });

  it('is truthy', () => {
    expect(component).toBeTruthy();
  });
});
