import { getErrorByCode } from "./impl";

export interface ErrorInfo {
  code: number;
  message: string;
}

export const API_PREFIX = "/api";

export { getErrorByCode } from "./impl";

export interface ResponseError {
  code: number;
  msg: string;
}

/** Response for any api request. */
export interface Response<T> {
  data?: T;
  error?: ResponseError;
}

export { makeAPIRequest } from "./impl";
