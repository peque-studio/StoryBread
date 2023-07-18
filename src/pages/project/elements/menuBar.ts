import { E } from "../../../html";
import { IReadonlyState, dependentState } from "statec";
import * as api from "../api";
import { createButton, createConfirmIconButton, createIconButton } from "./buttons";

export default function createMenuBar(project: IReadonlyState<api.Project>) {
	return dependentState(project, (project) => {
		return E("div.menu-bar", (el) => {
			el.append(
				createIconButton("arrow-left", "/home"),
				E("div.menu-bar-separator"),
				createButton("Test", () => {}),
				createIconButton("upload", () => {}),
				E("div.menu-bar-separator"),
				createIconButton("plus", () => {}),
				createConfirmIconButton("trash", () => {}, { kind: "danger" }),
			);
		});
	});
}
