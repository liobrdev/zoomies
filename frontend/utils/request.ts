import superagent, { Response } from 'superagent';
import prefix from 'superagent-prefix';
import { v4 as uuidv4 } from 'uuid';

import isEmpty from 'lodash/isEmpty';

import { IErrorInfo } from '@/types';


const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const parseErrorResponse = (
  resBody: any,
  fields: string[],
): IErrorInfo => {
  const error: IErrorInfo = {};

  if (!!resBody) {
    // Check for error detail in API response
    if (typeof resBody.detail === 'string') {
      error['detail'] = [{ id: uuidv4(), msg: resBody.detail }];
    }

    // Check for non-field errors in API response
    if (
      Array.isArray(resBody.nonFieldErrors)
      && resBody.nonFieldErrors.every((msg: any) => typeof msg === 'string')
    ) {
      error['nonField'] =
        resBody.nonFieldErrors.map((msg: string) => ({ id: uuidv4(), msg }));
    }

    // Check for field errors in API response
    if (fields.length > 0 && !isEmpty(resBody.fieldErrors)) {
      fields.forEach(field => {
        const errors = resBody.fieldErrors[field];

        if (
          Array.isArray(errors)
          && errors.every((e: any) => typeof e === 'string')
        ) {
          error[field] = errors.map((msg: string) => ({ id: uuidv4(), msg }));
        }
      });
    }
  }

  return error;
};

export type { Response };

export const request =
  superagent
    .agent()
    .use(prefix(baseURL))
    .set({ 'Content-Type': 'application/json' });
