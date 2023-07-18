import { ConstState, IReadonlyState, dependentState, effectNow } from "statec";
import { E, appendHTMLState } from "../../html";
import * as api from "./api";
import ProjectEditor from "./elements/projectEditor";

import "./assets/styles.css";
import "../common.css";

window.addEventListener("load", async () => {
	const project = new ConstState(await api.getProject("test"));
	effectNow(project, (project) => {
		const editor = new ProjectEditor(project);
		document.body.replaceChildren(...editor.create());
	});
});
