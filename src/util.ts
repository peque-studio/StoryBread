import { IReadonlyState } from "statec";

export type Primitive =
	| bigint
	| boolean
	| null
	| number
	| string
	| symbol
	| undefined
	| Date
	| Function;

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

export const arrayDiff = <T>(news: T[], olds: T[], eq: (a: T, b: T) => boolean) => ({
	added: news
		.map((item, index) => [item, index] as const)
		.filter(([newItem, _]) => !olds.find((oldItem) => eq(newItem, oldItem)))
		.map(([item, index]) => ({ index, item })),
	removed: olds
		.map((item, index) => [item, index] as const)
		.filter(([oldItem, _]) => !news.find((newItem) => eq(newItem, oldItem)))
		.map(([item, index]) => ({ index, item })),
});

export const getRandomElement = (arr: Array<any>) => {
	return arr[Math.floor(Math.random() * arr.length)];
};
