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
});
