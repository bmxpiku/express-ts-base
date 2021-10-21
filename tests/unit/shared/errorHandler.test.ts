import { Response, Request, NextFunction } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import Joi, { ValidationErrorItem } from 'joi';
import logger from '@src/logger/Logger';
import { unknownErrorHandler, validationErrorHandler } from '@src/shared/errorHandler';
import { StatusCodes } from 'http-status-codes';

describe('errorHandler', () => {
  describe('validationErrorHandler', () => {
    it('should handle the Joi error', () => {
      // given
      const error: ExpressJoiError = {
        error: {
          details: [
            { context: { key: 'test' }, message: 't3st' } as ValidationErrorItem,
          ],
        },
      } as ExpressJoiError;
      const JoiIsErrorMock = jest.spyOn(Joi, 'isError').mockReturnValueOnce(true);
      const loggerDebugMock = jest.spyOn(logger, 'debug');
      const responseJsonMock = jest.fn();
      const responseStatusMock = jest.fn().mockReturnValueOnce({ json: responseJsonMock });
      const responseMock = { status: responseStatusMock } as unknown as Response;
      const nextFunctionMock = jest.fn() as NextFunction;
      const requestMock = jest.fn() as unknown as Request;

      // when
      validationErrorHandler(error, requestMock, responseMock, nextFunctionMock);

      // then
      expect(JoiIsErrorMock).toHaveBeenCalledWith(error.error);
      expect(loggerDebugMock).toHaveBeenCalledWith(error);
      expect(responseStatusMock).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(responseJsonMock).toHaveBeenCalledWith([{ field: 'test', error: 't3st' }]);
      expect(nextFunctionMock).not.toHaveBeenCalled();
    });

    it('should ignore not joi error', () => {
      // given
      const error = { error: {} };
      const JoiIsErrorMock = jest.spyOn(Joi, 'isError').mockReturnValueOnce(false);
      const loggerDebugMock = jest.spyOn(logger, 'debug');
      const responseStatusMock = jest.fn();
      const responseMock = { status: responseStatusMock } as unknown as Response;
      const nextFunctionMock = jest.fn() as NextFunction;
      const requestMock = jest.fn() as unknown as Request;

      // when
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validationErrorHandler(error as any, requestMock, responseMock, nextFunctionMock);

      // then
      expect(JoiIsErrorMock).toHaveBeenCalledWith(error.error);
      expect(loggerDebugMock).not.toHaveBeenCalled();
      expect(responseStatusMock).not.toHaveBeenCalled();
      expect(nextFunctionMock).toHaveBeenCalledWith(error);
    });
  });

  describe('unknownErrorHandler', () => {
    it('should handle any error', () => {
      // given
      const error = new Error();
      const loggerErrorMock = jest.spyOn(logger, 'error');
      const responseSendMock = jest.fn();
      const responseStatusMock = jest.fn().mockReturnValueOnce({ send: responseSendMock });
      const responseMock = { status: responseStatusMock } as unknown as Response;
      const nextFunctionMock = jest.fn() as NextFunction;
      const requestMock = jest.fn() as unknown as Request;

      // when
      unknownErrorHandler(error, requestMock, responseMock, nextFunctionMock);

      // then
      expect(loggerErrorMock).toHaveBeenCalledWith(error);
      expect(responseStatusMock).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(responseSendMock).toBeCalled();
    });
  });
});
