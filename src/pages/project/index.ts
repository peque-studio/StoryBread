import { ConstState } from "../../state";
import { E, appendHTMLState } from "../../html";
import { getProject } from "./api/impl";
import createMenuBar from "./elements/menuBar";
import createNodeEditorIn from "./elements/nodeEditor";

import "./assets/styles.css";
import "../common.css";

window.addEventListener("load", async () => {
	const project = new ConstState(await getProject("test"));
	appendHTMLState(document.body, createMenuBar(project));
	document.body.append(
		E("main", (e) => createNodeEditorIn(e, project)),
	);
});
