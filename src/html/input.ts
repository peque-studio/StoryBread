import { IState, effectNow } from "statec";
import { Configurable, E } from ".";

export type InputType = "text" | "date" | "password" | "number";
type TypedHTMLInputElement<Type extends InputType> = HTMLInputElement & { type: Type };

type ConfigurableInput<Type extends InputType>
	= Configurable<TypedHTMLInputElement<Type>> & {
		cInput: (f: (el: Configurable<TypedHTMLInputElement<Type>>) => void)
			=> ConfigurableInput<Type>
	}

export function createInput(
	controlledState: IState<string>,
	placeholder?: string,
	label?: string
): ConfigurableInput<"text">

export function createInput<Type extends InputType>(
	controlledState: IState<string>,
	type: Type,
	placeholder?: string,
	label?: string
): ConfigurableInput<Type>

export function createInput<Type extends InputType = "text">(
	controlledState: IState<string>,
	type?: Type,
	placeholder?: string,
	label?: string
) {
	const input = E("input.input-wrapper__input", (el) => {
		el.type = type ?? "text";
		el.placeholder = placeholder ?? "";
		el.addEventListener("input", (e) => {
			controlledState.update(el.value)
		});
		effectNow(controlledState, (value) => {
			el.value = value
		})
	}) as Configurable<TypedHTMLInputElement<Type>>;

	const inputWrapper = E("div.input-wrapper", (el) => {
		if (label)
		el.append(E("p.input-wrapper__label", el => {
			el.textContent = label
		}))
		el.append(input)
	}) as ConfigurableInput<Type>
	
	inputWrapper.cInput = (f) => {
		f(input);
		return inputWrapper;
	}

	return inputWrapper;
}