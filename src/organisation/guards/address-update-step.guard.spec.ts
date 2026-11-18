import { ActivatedRouteSnapshot, Data } from '@angular/router';
import { of } from 'rxjs';
import { AddressUpdateDraft } from '../models/address-update.model';
import { AddressUpdateStep, AddressUpdateStepGuard } from './address-update-step.guard';

describe('AddressUpdateStepGuard', () => {
  let router;
  let store;
  let guard: AddressUpdateStepGuard;
  let selectedDraft: AddressUpdateDraft;

  const draft = (overrides: Partial<AddressUpdateDraft> = {}): AddressUpdateDraft => ({
    address: {
      addressLine1: '1 High Street',
      addressLine2: null,
      addressLine3: null,
      postTown: 'London',
      county: null,
      country: 'UK',
      postCode: 'SW1A 1AA'
    },
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    inInternationalMode: false,
    showExistingAddress: true,
    ...overrides
  });

  const route = (addressUpdateStep: AddressUpdateStep): ActivatedRouteSnapshot => ({
    data: { addressUpdateStep } as Data
  } as ActivatedRouteSnapshot);

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue('update-address-url-tree');
    store = jasmine.createSpyObj('Store', ['pipe']);
    store.pipe.and.callFake((...operators: any[]) => operators.slice(1).reduce(
      (source, operator) => operator(source),
      of(selectedDraft)
    ));
    guard = new AddressUpdateStepGuard(store, router);
  });

  it('should allow the DX question after an address has been entered', (done) => {
    selectedDraft = draft();

    guard.canActivate(route('document-exchange-reference')).subscribe((result) => {
      expect(result).toBeTrue();
      expect(router.createUrlTree).not.toHaveBeenCalled();
      done();
    });
  });

  it('should block a later step when the address step has not been completed', (done) => {
    selectedDraft = draft({ showExistingAddress: false });

    guard.canActivate(route('document-exchange-reference')).subscribe((result) => {
      expect(result).toBe('update-address-url-tree' as any);
      expect(router.createUrlTree).toHaveBeenCalledWith(['/organisation/update-address']);
      done();
    });
  });

  it('should only allow DX details after yes has been selected', (done) => {
    selectedDraft = draft({ hasDxReference: false });

    guard.canActivate(route('document-exchange-reference-details')).subscribe((result) => {
      expect(result).toBe('update-address-url-tree' as any);
      done();
    });
  });

  it('should allow check answers after no DX reference has been selected', (done) => {
    selectedDraft = draft({ hasDxReference: false });

    guard.canActivate(route('check')).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should require the DX details step before allowing check answers', (done) => {
    selectedDraft = draft({
      hasDxReference: true,
      dxNumber: '123',
      dxExchange: null
    });

    guard.canActivate(route('check')).subscribe((result) => {
      expect(result).toBe('update-address-url-tree' as any);
      done();
    });
  });

  it('should allow check answers after the optional DX details step is submitted', (done) => {
    selectedDraft = draft({
      hasDxReference: true,
      dxNumber: '',
      dxExchange: ''
    });

    guard.canActivate(route('check')).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });
});
