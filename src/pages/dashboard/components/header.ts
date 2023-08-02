import { E } from "../../../html";

export default function createHeader(title: string, username: string) {
    return E("div.header.container", el => {
        el.append(
            E("h1.header__title", el => {
                el.textContent = title
            }),
            E("h1.header__username", el => {
                el.append(E("a", el => {
                    el.href = "/profile"
                    el.textContent = `@${username}`
                }))
            })
        )
    })
}