import { API_PREFIX, type Response, type ResponseError } from ".";

const errorCodeMap: { [code: number]: string } = {
	420: "cum",
};

export function getErrorByCode(code: number) {
	const message = errorCodeMap?.[code];
	return message ? { message } : undefined;
}

export function getResponseError(error: ResponseError) {
	return getErrorByCode(error.code) ?? error.msg;
}

export async function makeAPIRequest<ResponseType>(
	method: string,
	payload?: any,
): Promise<ResponseType> {
	const response = await fetch(`${API_PREFIX}/${method}`, {
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
		method: payload === undefined ? "GET" : "POST",
	});
	if (Math.trunc(response.status / 100) === 5) {
		throw "Server did not send normal answer";
	}

	const { data, error } = (await response.json()) as Response<ResponseType>;
	if (!response.ok) {
		throw error ? getResponseError(error) : "Unknown Error";
	}

	return data!;
}