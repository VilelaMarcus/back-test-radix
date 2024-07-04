/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import { asyncPipe } from '../utils/async-pipe';
import { HttpError } from '../utils/errors';
import type { ApiErrorResponse } from '../utils/types';

const createRoute =
  (...middleware: any[]) =>
  async <ResponseData>(
    request: Request,
    response: Response<ResponseData | ApiErrorResponse>,
  ) => {
    try {
      await asyncPipe(...middleware)({ request, response });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      response.set('Content-Type', 'application/problem+json');

      if (error instanceof HttpError) {
        return response
          .status(error.code)
          .json({ message: error.message, code: error.code });
      }

      return response
        .status(500)
        .json({ message: 'Internal Server Error', code: 500 });
    }
  };

export default createRoute;
