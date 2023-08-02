import "./assets/styles.scss"
import "../common.css"
import { E } from "../../html";
import * as api from "../../api"
import createDashboard from "./components/dashboard";
import { BasicState, ConstState } from "statec";

window.addEventListener("load", async () => {
    const user: api.User = {
        username: new BasicState("dorsey"),
        id: new ConstState("-1"),
        email: new BasicState("am@og.us")
    }

    document.body.append(E("main", (e) => e.append(createDashboard(user))))
})