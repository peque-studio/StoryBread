import * as api from "../../../api"
import { E } from "../../../html"
import createCard from "./card"

export default function createSection(name: string, projects: api.Project) {
    return E("div.section.container", el => {
        el.append(
            E("h1.section__name", el => {
                el.textContent = name
            }),
            E("div.section__grid", el => {
                for (const project of projects) {
                    el.append(createCard(project?.name, project?.background))
                }
            })
        )
    })
}