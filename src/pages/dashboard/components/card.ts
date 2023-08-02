import { E } from "../../../html"

export default function createCard(text?: string, background?: string) {
    return E("div.card", el => {
        if (background)
            el.style.background = background
        if (text)
            el.append(E("p.card__text", el => {
                el.textContent = text
            }))
    })
}