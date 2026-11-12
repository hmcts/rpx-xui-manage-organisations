import { SimpleChange } from '@angular/core';
import { DocumentExchangeQuestionComponent } from './document-exchange-question.component';

describe('DocumentExchangeQuestionComponent', () => {
  it('should preselect an existing answer', () => {
    const component = new DocumentExchangeQuestionComponent();
    component.hasDxReference = false;

    component.ngOnChanges({
      hasDxReference: new SimpleChange(undefined, false, true)
    });

    expect(component.formGroup.get('documentExchange').value).toBe('no');
  });

  it('should emit the selected answer', () => {
    const component = new DocumentExchangeQuestionComponent();
    component.formGroup.get('documentExchange').setValue('yes');
    spyOn(component.submitted, 'emit');

    component.onContinue();

    expect(component.submitted.emit).toHaveBeenCalledWith(true);
  });

  it('should show an error when no answer is selected', () => {
    const component = new DocumentExchangeQuestionComponent();

    component.onContinue();

    expect(component.errors).toEqual([{
      id: 'document-exchange-yes',
      message: 'Please select an option'
    }]);
  });
});
