import * as api from "../../../api";
import { E } from "../../../html";
import { createButton } from "../../../html/buttons";
import createHeader from "./header";
import createSection from "./section";

const personalProjects = [
    {name: "tesuto", id: "0", background: "gray"},
    {name: "toxic", id: "1"},
    {name: "this is the end of everything", id: "3"},
    {name: "tesuto", id: "0", background: "gray"},
    {name: "toxic", id: "1"},
    {name: "", id: "3"},
    {name: "tesuto", id: "0", background: "gray"},
    {name: "toxic", id: "1"},
    {name: "", id: "3"},
]
const sharedProjects = [
    {name: "general", id: "00", background: "gray"},
    {name: "friendly", id: "69"},
    {name: "fumo", id: "42"}
]

export default function createDashboard(user: api.User) {
    return E("div.wrapper", (el) => {
        el.append(
            createHeader("your stories", user.username.get()),
            createSection(
                "personal",
                createButton("start new story", "/new", {
                    icon: "plus"
                }),
             personalProjects
            ),
            createSection(
                "shared", 
                createButton("join by code", "/join", {
                    icon: "link"
                }),
                sharedProjects
            ),
        )
    })
}