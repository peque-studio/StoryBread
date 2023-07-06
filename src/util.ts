import { IReadonlyState } from "./state";

export type Primitive = bigint | boolean | null | number | string | symbol | undefined | Date | Function;

type IsStateful_<P, T> = T extends IReadonlyState<unknown> ? P : never;
type ToStateless_<T> = T extends IReadonlyState<infer V>
	? V extends Array<infer E>
		? StatelessProps<E>[]
		: StatelessProps<V>
	: T extends Array<infer E>
	? StatelessProps<E>[]
	: [T] extends [Primitive]
	? T
	: StatelessProps<T>;

export type StateInitialProps<T> = {
	[P in keyof T as IsStateful_<P, T[P]>]: ToStateless_<T[P]>;
};

export type StatelessProps<T> = {
	[P in keyof T]: ToStateless_<T[P]>;
};
