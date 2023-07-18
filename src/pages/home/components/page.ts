import { dependentState } from "statec";
import { appendHTMLState } from "../../../html";
import * as api from 'api'

export default function createPage(
    parent: HTMLElement
) {
    const user
    appendHTMLState(parent, dependentState(user: api))
}