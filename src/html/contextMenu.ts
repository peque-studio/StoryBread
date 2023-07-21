import { BasicState, IState, dependentState } from "statec";
import {
	ButtonIcon,
	ButtonKind,
	ClickCallback,
	createButton,
	createButtonLikeDiv,
} from "./buttons";
import { E, Pos, appendHTMLState } from ".";

export type MenuItem =
	| {
			name: string;
			icon?: ButtonIcon;
			kind?: ButtonKind;
			target: string | ClickCallback;
	  }
	| { name: string; icon?: ButtonIcon; kind?: ButtonKind; items: MenuItem[] }
	| "separator";

function menuItemToElement(item: MenuItem) {
	if (item === "separator") {
		return E("div.context-menu-separator");
	} else if ("target" in item) {
		return E("div.context-menu-item", (el) => {
			el.append(
				createButton(item.name, item.target, {
					kind: item.kind,
					icon: item.icon,
				}),
			);
		});
	} else if ("items" in item) {
		return E("div.context-menu-item", (el) => {
			el.append(
				createButtonLikeDiv(item.name, {
					kind: item.kind,
					icon: item.icon,
				}),
				E("div.context-submenu", (submenuEl) => {
					submenuEl.append(...item.items.map(menuItemToElement));
				}),
			);
		});
	} else {
		throw "bad context menu item.";
	}
}

declare global {
	interface Window {
		globalContextMenuState: IState<undefined>;
	}
}

if (!window.globalContextMenuState) {
	window.globalContextMenuState = new BasicState<undefined>(undefined);
}

window.addEventListener("click", () => {
	window.globalContextMenuState.update(undefined);
});

window.addEventListener("contextmenu", () => {
	window.globalContextMenuState.update(undefined);
});

export default function createContextMenuFor(
	el: HTMLElement,
	getMenu: () => MenuItem[],
) {
	const isOpen = new BasicState<null | Pos>(null);

	el.addEventListener("contextmenu", (ev) => {
		window.globalContextMenuState.update(undefined);
		isOpen.update({ x: ev.clientX, y: ev.clientY });
		ev.preventDefault();
		ev.stopPropagation();
	});

	window.globalContextMenuState.effect(() => isOpen.update(null));

	appendHTMLState(
		document.body,
		dependentState(isOpen, (isOpen) =>
			!isOpen
				? null
				: E("div.context-menu", (el) => {
						el.style.left = `${isOpen.x}px`;
						el.style.top = `${isOpen.y}px`;
						const menu = getMenu();
						el.append(...menu.map(menuItemToElement));
				  }),
		),
	);
}
