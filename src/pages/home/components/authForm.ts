import {
	IState,
	dependentState,
	IReadonlyState,
	BasicState,
	effectNow,
} from "statec";
import { E } from "../../../html";
import { InputType, createInput } from "../../../html/input";
import { getRandomElement } from "../../../util";
import { createButton } from "../../../html/buttons";
import * as api from "../api";
const Errors = {
	emptyUsername: [
		"Who are you?",
		"You're called 'Empty'?",
		"Is your name 'no name'? Cuz the name 'no name' is not allowed!",
	],
	username: ["You can't use this username"],
	emptyPassword: ["No password??", "You don't have a password??"],
	password: ["Please make your password stronger"],
	email: ["Your email address is incorrect"],
};
import Logo from '../assets/logo.svg'
import HeartEmoji from '../assets/heart.png'

interface FormField {
	label?: string;
	placeholder?: string;
	validator?: (value: string) => boolean;
	type?: InputType;
}

interface StatefulFormField extends FormField {
	value: IState<string>;
	valid: IReadonlyState<boolean>;
}

export function createStatefulFormField(
	initialValue: string,
	field?: FormField,
): StatefulFormField {
	const value = new BasicState(initialValue);
	return {
		value,
		valid: dependentState(value, (v) => field?.validator?.(v) ?? true),
		...(field ?? []),
	};
}

const createPasswordField = (initialValue: string): StatefulFormField =>
	createStatefulFormField(initialValue, {
		validator: (password) => password.length >= 8,
		label: "Password",
		placeholder: "P@s$w0rD",
	});

const createUsernameField = (initialValue: string): StatefulFormField =>
	createStatefulFormField(initialValue, {
		validator: (username) => username.length >= 3,
		label: "Username",
		placeholder: "letters_n_nums",
	});

const createEmailField = (initialValue: string): StatefulFormField =>
	createStatefulFormField(initialValue, {
		validator: (email) => email.includes("@"),
		label: "Email",
		placeholder: "example@email.com",
	});

type IForm = {
	[key: string]: StatefulFormField;
};

/*
export function createForm(form: IForm) {
	return E("div", (el) => {
		for (const [name, field] of Object.entries(form)) {
			if (field.label)
				el.appendChild(
					E("div.form-field-label", (el) => {
						el.textContent = field.label!;
					}),
				);

			el.appendChild(
				createInput(
					new BasicState(""),
					field.type ?? "text",
					field.placeholder ?? field.label ?? name ?? "",
				).configInput((el) => {
					el.style.border = "none";
				}),
			);
		}
	});
}
*/

interface AuthForm extends IForm {
	username: StatefulFormField;
	password: StatefulFormField;
}

function getStatefulAuthForm(): AuthForm {
	return {
		username: createUsernameField(""),
		password: createPasswordField(""),
	};
}

export function createAuthForm() {
	const formData = getStatefulAuthForm();
	const username = formData.username.value;
	const password = formData.password.value;

	function tryAuthUser(): void {
		if (formData.username.valid.get() && formData.password.valid.get())
			api.authUser(username.get(), password.get());
	}

	return E("div.auth-form", (el) => {
		el.append(
			E("h1.auth-form__title", (el) => {
				el.textContent = "welcome to StoryBread";
			}),
			E("div.auth-form__wrapper", (el) => {
				el.append(
					E("div.auth-form__input", (el) => {
						el.append(
							createInput(
								username,
								"text",
								formData.username.placeholder,
								formData.username.label,
							),
						);
					}),
					E("div.auth-form__input", (el) => {
						el.append(
							createInput(
								password,
								"password",
								formData.password.placeholder,
								formData.password.label,
							),
						);
					}),
					E("div.auth-form__submit", (el) => {
						el.append(
							createButton("Submit", () => {
								tryAuthUser();
							}).c((el) => {
								el.style.width = "100%";
								el.style.justifyContent = "center";
							}),
						);
					}),
					E("div.auth-form__link", (el) => {
						el.append(E("a", el => {
							el.href = "/register"
							el.textContent = "i don't have account"
						}))
					})
				);
			}),
			E("div.status__wrapper", (el) => {
				el.append(
					E("h5.status__box", (el) => {
						effectNow(formData.username.valid, () => {
							if (!formData.username.valid.get() && username.get()) {
								el.style.display = "block";
								el.textContent = getRandomElement(Errors.username);
							} else {
								el.style.display = "none";
							}
						});
					}),
					E("h5.status__box", (el) => {
						effectNow(formData.password.valid, () => {
							if (!formData.password.valid.get() && password.get()) {
								el.style.display = "block";
								el.textContent = getRandomElement(Errors.password);
							} else {
								el.style.display = "none";
							}
						});
					}),
				);
			}),
			E("div.footer", (el) => {
				el.append(
					E("span.footer__text", el => {
						el.textContent = "made with"
					}),
					E("img.footer__img", el => {
						el.src = HeartEmoji
						el.style.height = "20px"
					}),
					E("span.footer__text", el => {
						el.textContent = "by"
					}),
					E("img.footer__img", el => {
						el.src = Logo
						el.style.height = "20px"
					})
				)
			})
		);
	});
}
