import { IReadonlyState, IState, effectNow } from "./state";

export const Q = <T extends HTMLElement>(s: string) => document.querySelector<T>(s);

type _MatchSelector<T extends string> = T extends `${infer P extends keyof HTMLElementTagNameMap}.${string}`
	? P
	: T extends `${infer P extends keyof HTMLElementTagNameMap}#${string}`
	? P
	: T extends keyof HTMLElementTagNameMap
	? T
	: never;

type _SelectorInfo = {
	elem: string;
	classes: string[];
	id: string | undefined;
};

const _extractSelector = (s: string) => {
	const sel: _SelectorInfo = { classes: [], id: undefined, elem: "" };
	sel.id = s.match(/#[\w_\-]+/)?.[0].slice(1);
	sel.classes = s.match(/\.[\w_\-]+/)?.map((m) => m.slice(1)) ?? [];
	sel.elem = s.match(/([\w_\-]+)(\.|#)?/)?.[1]!;
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

	const sel = _extractSelector(elemOrHandler);
	const e = document.createElement(sel.elem);
	if (sel.id) e.id = sel.id;
	sel.classes.forEach((c) => e.classList.add(c));

	if (handler) handler(e);
	return e;
}

export interface Pos {
	x: number;
	y: number;
}

export interface DragConfig {
	pos: IState<Pos, Pos>;
	enabled?: IReadonlyState<boolean>;
	onDragStart?: () => void;
	onDragEnd?: () => void;
	onDrag?: () => void;
}

export const makeDraggable = (e: HTMLElement, cfg: DragConfig) => {
	effectNow(cfg.pos, ({ x, y }) => {
		e.style.left = `${x}px`;
		e.style.top = `${y}px`;
	});

	e.addEventListener("mousedown", (ev) => {
		if (cfg.enabled && !cfg.enabled.get()) return;
		const offset = {
			x: cfg.pos.get().x - ev.clientX,
			y: cfg.pos.get().y - ev.clientY,
		};

		cfg.onDragStart?.();

		const moveListener = (ev: MouseEvent) => {
			if (cfg.enabled && !cfg.enabled.get()) {
				window.removeEventListener("mousemove", moveListener);
				return;
			}

			cfg.pos.update({
				x: ev.clientX + offset.x,
				y: ev.clientY + offset.y,
			});

			cfg.onDrag?.();
		};

		window.addEventListener("mousemove", moveListener);

		window.addEventListener(
			"mouseup",
			(ev) => {
				window.removeEventListener("mousemove", moveListener);
				if (!cfg.enabled || cfg.enabled.get()) cfg.onDragEnd?.();
			},
			{ once: true },
		);
	});
};
