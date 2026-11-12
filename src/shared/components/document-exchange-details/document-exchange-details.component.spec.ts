import { SimpleChange } from '@angular/core';
import { DocumentExchangeDetailsComponent } from './document-exchange-details.component';

describe('DocumentExchangeDetailsComponent', () => {
  it('should initialise and emit valid details', () => {
    const component = new DocumentExchangeDetailsComponent();
    component.dxNumber = '123';
    component.dxExchange = 'LONDON';
    component.ngOnChanges({
      dxNumber: new SimpleChange(undefined, '123', true),
      dxExchange: new SimpleChange(undefined, 'LONDON', true)
    });
    spyOn(component.submitted, 'emit');

    component.onContinue();

    expect(component.submitted.emit).toHaveBeenCalledWith({
      dxNumber: '123',
      dxExchange: 'LONDON'
    });
  });

  it('should reject details over their maximum lengths', () => {
    const component = new DocumentExchangeDetailsComponent();
    component.formGroup.setValue({
      dxNumber: '12345678901234',
      dxExchange: '123456789012345678901'
    });
    spyOn(component.submitted, 'emit');

    component.onContinue();

    expect(component.validationErrors.length).toBe(2);
    expect(component.submitted.emit).not.toHaveBeenCalled();
  });

  it('retains the registration default: an unpaired 20-character exchange is valid', () => {
    const component = new DocumentExchangeDetailsComponent();
    component.formGroup.setValue({ dxNumber: '', dxExchange: 'a'.repeat(20) });
    spyOn(component.submitted, 'emit');

    component.onContinue();

    expect(component.submitted.emit).toHaveBeenCalledWith({ dxNumber: '', dxExchange: 'a'.repeat(20) });
    expect(component.validationErrors).toEqual([]);
  });

  describe('address update configuration', () => {
    let component: DocumentExchangeDetailsComponent;

    beforeEach(() => {
      component = new DocumentExchangeDetailsComponent();
      component.dxExchangeMaxLength = 40;
      component.requirePairedDetails = true;
      component.ngOnChanges({ dxExchangeMaxLength: new SimpleChange(20, 40, false) });
      spyOn(component.submitted, 'emit');
    });

    it('accepts 13-character number and 40-character exchange inclusively without changing content', () => {
      const details = { dxNumber: 'DX 123456789 ', dxExchange: 'a'.repeat(40) };
      component.formGroup.setValue(details);

      component.onContinue();

      expect(component.submitted.emit).toHaveBeenCalledWith(details);
      expect(component.validationErrors).toEqual([]);
    });

    for (const [dxNumber, dxExchange, expected] of [
      ['', '', null],
      ['123', '', { id: 'dx-exchange', message: 'Enter DX exchange' }],
      ['', 'LONDON', { id: 'dx-number', message: 'Enter DX number' }],
      [' \t', 'LONDON', { id: 'dx-number', message: 'Enter valid DX number' }],
      ['123', ' \t', { id: 'dx-exchange', message: 'Enter valid DX exchange' }],
      [' ', '', { id: 'dx-number', message: 'Enter valid DX number' }],
      ['', ' ', { id: 'dx-exchange', message: 'Enter valid DX exchange' }],
      ['a'.repeat(14), 'LONDON', { id: 'dx-number', message: 'Enter valid DX number' }],
      ['123', 'a'.repeat(41), { id: 'dx-exchange', message: 'Enter valid DX exchange' }]
    ] as const) {
      it(`validates number ${JSON.stringify(dxNumber)} and exchange ${JSON.stringify(dxExchange)}`, () => {
        component.formGroup.setValue({ dxNumber, dxExchange });

        component.onContinue();

        if (expected) {
          expect(component.validationErrors).toEqual([expected]);
          expect(component.submitted.emit).not.toHaveBeenCalled();
        } else {
          expect(component.validationErrors).toEqual([]);
          expect(component.submitted.emit).toHaveBeenCalledWith({ dxNumber, dxExchange });
        }
      });
    }

    it('rejects both whitespace-only fields', () => {
      component.formGroup.setValue({ dxNumber: ' ', dxExchange: ' ' });

      component.onContinue();

      expect(component.validationErrors).toEqual([
        { id: 'dx-number', message: 'Enter valid DX number' },
        { id: 'dx-exchange', message: 'Enter valid DX exchange' }
      ]);
      expect(component.submitted.emit).not.toHaveBeenCalled();
    });

    it('clears pair errors when the user corrects the missing field', () => {
      component.formGroup.setValue({ dxNumber: '123', dxExchange: '' });
      component.onContinue();
      expect(component.dxExchangeError).toEqual({ id: 'dx-exchange', message: 'Enter DX exchange' });

      component.formGroup.controls.dxExchange.setValue('LONDON');
      component.onContinue();

      expect(component.validationErrors).toEqual([]);
      expect(component.dxExchangeError).toBeNull();
      expect(component.submitted.emit).toHaveBeenCalledWith({ dxNumber: '123', dxExchange: 'LONDON' });
    });
  });
});
