import { ArrayState, IReadonlyState, IState, effectNow } from "./state";
import { arrayDiff } from "./util";

/** Shorthand for {@link document.querySelector} */
export const Q = <T extends HTMLElement>(s: string) => document.querySelector<T>(s);

type _MatchSelector<T extends string> =
	T extends `${infer P extends keyof HTMLElementTagNameMap}.${string}`
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
	sel.classes = s.match(/\.[\w_\-]+/g)?.map((m) => m.slice(1)) ?? [];
	sel.elem = s.match(/([\w_\-]+)(\.|#)?/)?.[1]!;
	return sel;
};

/** Same as {@link E}('div', handler) */
export function E(handler: (e: HTMLDivElement) => void): HTMLDivElement;

/**
 * Create an element with the specified selector (currently supports classes and ids)
 * and call a function with that element.
 * @param elem Element selector.
 * @param handler Function that fills the element
 */
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

// TODO: Make this Pos thing unified somewhere.

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
	dragWith?: HTMLElement;
}

/** Make an element draggable. Changes `e.style.left` and `e.style.top`. */
export const makeDraggable = (e: HTMLElement, cfg: DragConfig) => {
	cfg.dragWith ??= e;

	effectNow(cfg.pos, ({ x, y }) => {
		// We don't have to check for cfg.enabled because:
		// a) that means that cfg.pos.get() and the styles will be out of sync.
		// b) cfg.pos isn't updated if the dragging is disabled anyway.
		e.style.left = `${x}px`;
		e.style.top = `${y}px`;
	});

	cfg.dragWith.addEventListener("mousedown", (ev) => {
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

export const appendHTMLState = (
	to: HTMLElement,
	state: IReadonlyState<ChildNode | null>,
) => {
	if (state.get() != null) to.appendChild(state.get()!);
	state.effect((newEl, oldEl) => {
		if (!oldEl && newEl) to.appendChild(newEl); // TODO: preserve location.
		else if (oldEl && !newEl) oldEl.remove();
		else if (oldEl && newEl) oldEl.replaceWith(newEl);
	});
};

export const appendHTMLArrayState = <T>(
	to: HTMLElement,
	state: IReadonlyState<T[]>,
	eq: (a: T, b: T) => boolean,
	getElement: (e: T) => HTMLElement,
) => {
	effectNow(state, (news, olds) => {
		const { added, removed } = arrayDiff(news, olds ?? [], eq);

		const toBeRemoved = new Set(removed.map((r) => r.index));
		// const toBeAdded = new Set(added.map(r => r.index));

		for (let i = 0; i < to.children.length; i++) {
			if (toBeRemoved.has(i)) to.children[i].remove();
		}

		// for (let i = 0, j = 0; i < to.children.length; i++) {
		// 	if (toBeAdded.has(i)) j++;
		// 	to.children[i].setAttribute('data-array-idx', `${i + j}`);
		// }

		for (const { index, item } of added) {
			if (index === 0) {
				to.prepend(getElement(item));
			} else {
				to.children[index - 1].after(getElement(item));
			}
		}
	});
};
