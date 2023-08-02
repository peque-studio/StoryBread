import { E } from "../../../html";
import Logo from '../../../public/sb-logo-thick.svg'

export default function createHeader(title: string, username: string) {
    return E("div.header.container", el => {
        el.append(
            E("h1.header__title", el => {
                el.textContent = title
            }),
            E("img.header__logo", el => {
                el.src = Logo
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