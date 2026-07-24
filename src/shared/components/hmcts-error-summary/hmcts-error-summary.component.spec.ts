import { SimpleChange } from '@angular/core';
import { HmctsErrorSummaryComponent } from './hmcts-error-summary.component';

describe('HmctsErrorSummaryComponent', () => {
  let component: HmctsErrorSummaryComponent;
  let element: jasmine.SpyObj<any>;
  let documentRef: jasmine.SpyObj<any>;

  beforeEach(() => {
    element = jasmine.createSpyObj('element', ['focus']);
    documentRef = jasmine.createSpyObj('document', ['querySelector']);
    component = new HmctsErrorSummaryComponent(documentRef);
  });

  it('should store incoming error messages', () => {
    const messages = [{ id: 'error-1', message: 'Required' }];

    component.errorMessages = messages;

    expect(component.messages).toEqual(messages);
  });

  it('should focus the error summary after view init and when messages change', () => {
    documentRef.querySelector.and.returnValue(element);

    component.ngAfterViewInit();
    component.ngOnChanges({
      errorMessages: new SimpleChange([], [{ message: 'Required' }], false)
    });

    expect(documentRef.querySelector).toHaveBeenCalledWith('#errorSummary');
    expect(element.focus).toHaveBeenCalledTimes(2);
  });

  it('should report whether an element exists', () => {
    documentRef.querySelector.and.returnValues(element, null);

    expect(component.hasElement('errorSummary')).toBe(element as any);
    expect(component.hasElement('missing')).toBeNull();
  });

  it('should track messages by id, text, or index', () => {
    expect(component.trackByMessage(0, { id: 'explicit-id' })).toBe('explicit-id#0');
    expect(component.trackByMessage(1, { text: 'Message text' })).toBe('Message text#1');
    expect(component.trackByMessage(2, {})).toBe(2);
  });
});
