import * as api from "../../../api"
import { Configurable, E } from "../../../html"
import { createButton } from "../../../html/buttons"
import createCard from "./card"

export default function createSection(name: string, button: Configurable<HTMLElement>, projects: api.Project) {
    return E("div.section.container", el => {
        el.append(
            E("div.section__top", el => {
                el.append(
                    E("h1.section__name", el => {
                        el.textContent = name
                    }),
                    button.c(el => {
                        el.classList.add("section__btn")
                    })
                )
            }),
            E("div.section__grid", el => {
                for (const project of projects) {
                    el.append(createCard(project?.name, project?.background))
                }
            })
        )
    })
}