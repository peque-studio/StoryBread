import * as feather from "feather-icons";
import { E, appendHTMLState } from ".";
import { BasicState, dependentState } from "statec";
import createIcon from "../icons";

export type ButtonKind = undefined | "important" | "danger";
export type ClickCallback = (ev: MouseEvent) => void;

function bindClickOrLink(
	el: HTMLButtonElement | HTMLAnchorElement,
	callbackOrLink: string | ClickCallback,
) {
	if (typeof callbackOrLink === "string") {
		(el as HTMLAnchorElement).href = callbackOrLink;
	} else {
		(el as HTMLButtonElement).addEventListener(
			"click",
			callbackOrLink as ClickCallback,
		);
	}
}

/**
 * Create an icon button. (A button without text, just an icon)
 * @todo Add tooltips and aria stuff.
 * @param icon The icon to use.
 * @param callbackOrLink Either `onclick` or an href.
 * @param options Button options.
 * @returns A button (or anchor) element.
 */
export function createIconButton(
	icon: keyof typeof feather.icons,
	callbackOrLink?: string | ClickCallback,
	options: Partial<{ kind: ButtonKind }> = {},
) {
	const isLink = typeof callbackOrLink === "string";
	return E(isLink ? "a.btn.icon" : "button.icon", (el) => {
		if (options.kind) el.classList.add(options.kind);
		el.append(createIcon(feather.icons[icon], { width: 16, height: 16 }));
		if (callbackOrLink) {
			bindClickOrLink(el, callbackOrLink);
		}
	});
}

/**
 * Create an icon button with a confirm interface.
 * @todo Add tooltips and aria stuff.
 * @param icon The icon to use.
 * @param callbackOrLink Either `onclick` or an href link.
 * @param options Button options.
 * @returns A button (or anchor) element.
 */
export function createConfirmIconButton(
	icon: keyof typeof feather.icons,
	callbackOrLink?: string | ClickCallback,
	options: Partial<{ kind: ButtonKind }> = {},
) {
	const isLink = typeof callbackOrLink === "string";
	return E(isLink ? "a.btn.icon" : "button.icon", (el) => {
		if (options.kind) el.classList.add(options.kind);
		const isAskingState = new BasicState(false);
		el.addEventListener("click", () => isAskingState.update(!isAskingState.get()));
		appendHTMLState(
			el,
			dependentState(isAskingState, (isAsking) => {
				if (!isAsking) {
					el.classList.remove("confirm-button-wrap");
					return createIcon(feather.icons[icon], { width: 16, height: 16 });
				} else {
					el.classList.add("confirm-button-wrap");
					return E("div.button-confirm-box", (boxEl) => {
						boxEl.append(
							createIconButton("x"),
							createIconButton("check", callbackOrLink, { kind: options.kind }),
						);
					});
				}
			}),
		);
	});
}

/**
 * Create a simple button.
 * @param text The button text.
 * @param callbackOrLink Either `onclick` or an href link.
 * @param options Button options, including an optional icon.
 * @returns A button (or anchor) element.
 */
export function createButton(
	text: string,
	callbackOrLink?: string | ClickCallback,
	options: Partial<{ icon: keyof typeof feather.icons; kind: ButtonKind }> = {},
) {
	return E("button", (el) => {
		if (options.kind) el.classList.add(options.kind);
		if (options.icon) {
			el.append(
				createIcon(feather.icons[options.icon], { width: 16, height: 16 }),
				E("span", (el) => {
					el.textContent = text;
				}),
			);
		} else {
			el.textContent = text;
		}
		if (callbackOrLink) bindClickOrLink(el, callbackOrLink);
	});
}