export type EffectFunc<V> = (value: V, old: V) => void;

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
