import { DefaultErrorHandler } from './defaultErrorHandler';

describe('Default Error Handler', () => {
  const mockedLoggerService = jasmine.createSpyObj('mockedLoggerService', ['error']);

  it('should be Truthy', () => {
    const errorHandler = new DefaultErrorHandler(mockedLoggerService);
    expect(errorHandler).toBeTruthy();
  });

  it('should be able to call error', () => {
    const errorHandler = new DefaultErrorHandler(mockedLoggerService);
    errorHandler.handleError(new Error('Some Error Message'));
    expect(mockedLoggerService.error).toHaveBeenCalledWith(new Error('Some Error Message'));
  });
});
