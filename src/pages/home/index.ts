import "./assets/styles.scss";
import "../common.css";
import createPage from "./components/page";
import { E } from "../../html";
import { getUser } from "./api";

window.addEventListener("load", async () => {
	// const user = await getUser()
	const user = null;

	document.body.append(E("main", (e) => e.append(createPage(user))));
});
