export type UUID = string;

export const API_PREFIX = "/api";

export interface ErrorInfo {
	code: number;
	message: string;
}

export interface ResponseError {
	code: number;
	msg: string;
}

/** Response for any api request. */
export interface Response<T> {
	data?: T;
	error?: ResponseError;
}

export { makeAPIRequest, getErrorByCode, getResponseError } from "./impl";
