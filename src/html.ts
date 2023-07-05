export const Q = <T extends HTMLElement>(s: string) => document.querySelector<T>(s);

type _MatchSelector<T extends string> = T extends `${infer P extends keyof HTMLElementTagNameMap}.${string}`
	? P
	: T extends `${infer P extends keyof HTMLElementTagNameMap}#${string}`
	? P
	: T extends keyof HTMLElementTagNameMap
	? T
	: never;

type _SelectorInfo = {
	classes: string[];
	id: string | undefined;
};

const _extractSelector = (s: string) => {
	const sel: _SelectorInfo = { classes: [], id: undefined };
	sel.id = s.match(/#[\w_\-]/)?.[0];
	sel.classes = s.match(/\.[\w_\-]/)?.map((m) => m) ?? [];
	return sel;
};

export function E(handler: (e: HTMLDivElement) => void): HTMLDivElement;
export function E<U extends string>(
	elem: U,
	handler?: (e: HTMLElementTagNameMap[_MatchSelector<U>]) => void,
): HTMLElementTagNameMap[_MatchSelector<U>];

export function E(
	elemOrHandler: string | ((e: HTMLDivElement) => void) | ((e: HTMLElement) => void),
	handler?: (e: HTMLElement) => void,
): HTMLElement {
	if (typeof elemOrHandler !== "string") {
		return E("div" as const, elemOrHandler as (e: HTMLElement) => void);
	}
	
	const e = document.createElement(elemOrHandler);

	const sel = _extractSelector(elemOrHandler);
	if (sel.id) e.id = sel.id;
	sel.classes.forEach((c) => e.classList.add(c));

	if (handler) handler(e);
	return e;
}
