import { ConstState } from "statec";
import { E, appendHTMLState } from "../../html";
import * as api from "./api";
import createMenuBar from "./elements/menuBar";
import createProjectEditorIn from "./elements/projectEditor";

import "./assets/styles.css";
import "../common.css";

window.addEventListener("load", async () => {
	const project = new ConstState(await api.getProject("test"));
	appendHTMLState(document.body, createMenuBar(project));
	document.body.append(E("main", (e) => createProjectEditorIn(e, project)));
});
