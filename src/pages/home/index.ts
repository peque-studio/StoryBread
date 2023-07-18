import "./assets/styles.scss";
import "../common.css";
import createPage from "./components/page";
import { E } from "../../html";

window.document.addEventListener("load", () => {
    document.body.append(E("main", (e) => createPage(e)))
})