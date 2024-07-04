/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

export type Factory<Shape> = (state?: Partial<Shape>) => Shape;

export type ApiHandler<A = any, B = any> = ({
  request,
  response,
}: {
  request: CustomApiRequest<A>;
  response: Response<B>;
}) => void | Promise<void>;

export type ApiErrorResponse = { message: string; code: number };

export interface CustomApiRequest<P> extends Omit<Request, 'query' | 'body'> {
  query: {
    [key: string]: string;
  };
  body: P;
}

/**
 * Returns type of the value for a resolved promise, the return type of a
 * function or the resolved value for a promise returning function.
 */
export type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...arguments_: any) => Promise<infer U>
  ? U
  : T extends (...arguments_: any) => infer U
  ? U
  : T;

export type RequestResponseObject<RequestData = any, ResponseData = any> = {
  request: CustomApiRequest<RequestData>;
  response: Response<ResponseData>;
};
