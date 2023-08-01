import { E } from "../../../html";
import * as api from "../api";
import { createAuthForm } from "./authForm";

export default function createPage(user: api.User | null) {
	if (!user) {
		return createAuthForm();
	} else {
		return E("div.main-wrapper", (el) => {
			el.append(
				E("header", (el) => {
					el.append();
				}),
			);
		});
	}
}
