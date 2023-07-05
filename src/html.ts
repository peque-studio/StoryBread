
export const Q = <T extends HTMLElement>(s: string) =>
	document.querySelector<T>(s);

export function E(handler: (e: HTMLDivElement) => void): HTMLDivElement;
export function E<T extends keyof HTMLElementTagNameMap>(
	elem: T,
	handler?: (e: HTMLElementTagNameMap[T]) => void
): HTMLElementTagNameMap[T];

export function E(
	elemOrHandler: string | ((e: HTMLDivElement) => void),
	handler?: (e: HTMLElement) => void
): HTMLElement {
	if (typeof elemOrHandler !== 'string') {
		return E('div', elemOrHandler);
	}
	const e = document.createElement(elemOrHandler);
	if (handler) handler(e);
	return e;
}
