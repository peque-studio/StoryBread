export type EffectFunc<V, O = V> = (value: V, old: O) => void;

/** A readonly "window" into a state. May be updated elsewhere. */
export interface IReadonlyState<V> {
	get(): V;
	effect(func: EffectFunc<V>): void;
}

/** A state. Can be updated. */
export interface IState<V, T> extends IReadonlyState<V> {
	update(trans: T): void;
}

/** The default state implementation. */
export default class State<V, T> implements IState<V, T> {
	private value: V;
	private effects: EffectFunc<V>[];

	constructor(initial: V, private handler: (trans: T, current: V) => V) {
		this.value = initial;
		this.effects = [];
	}
	
	update(trans: T): void {
		const old = this.value;
		this.value = this.handler(trans, old);
		this.effects.forEach(e => e(this.value, old));
	}

	get(): V {
		return this.value;
	}

	effect(func: EffectFunc<V>): void {
		this.effects.push(func);
	}
}

/** Simlest state possible. */
export class ConstState<V> extends State<V, never> {
	constructor(value: V) {
		super(value, (_, value) => value);
	}
}

/** State where the transaction is the new value. */
export class BasicState<V> extends State<V, V> {
	constructor(initial: V) {
		super(initial, newValue => newValue);
	}
}

/** State for an array. */
export class ArrayState<E> extends State<E[], { add: E } | { remove: E }> {
	constructor(initial: E[]) {
		super(initial, (trans, current) => {
			const list = [...current];
			if ('add' in trans) list.push(trans.add);
			if ('remove' in trans) list.splice(list.indexOf(trans.remove), 1);
			return list;
		});
	}
}

export const HTMLState = ConstState<HTMLElement>;

/** Bind the effect callback and call it immediately (with `old = undefined`). */
export const effectNow = <V>(s: IReadonlyState<V>, effect: EffectFunc<V, V | undefined>) => {
	s.effect(effect);
	effect(s.get(), undefined);
};

/**
 * Create a state that depends on another state.
 * The `getValue` function is called immediately.
 * On `state` update, the dependent value is replaced
 * with the return value of the `getValue` function.
 * (see {@link BasicState})
 **/
export const dependentState = <V, U>(
	state: IReadonlyState<V>,
	getValue: (value: V, old: V | undefined) => U
): IReadonlyState<U> => {
	const dependentState = new BasicState(getValue(state.get(), undefined));
	state.effect((value, old) => dependentState.update(getValue(value, old)))
	return dependentState;
};
