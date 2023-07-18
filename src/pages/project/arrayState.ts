import { State } from "statec";

// this will be moved to statec.

export type ArrayStateTrans<E, Id> =
	| { push: E }
	| { remove: E }
	| { insert: E; at: number }
	| { removeAt: number }
	| { removeBy: Id }
	| { filter: (v: E) => boolean };

export default class ArrayState<E, Id> extends State<E[], ArrayStateTrans<E, Id>> {
	private getId: (v: E) => Id;
	constructor(initial: E[], getId: (v: E) => Id) {
		super(initial, (trans, current) => {
			if ("push" in trans) {
				return [...current, trans.push];
			} else if ("filter" in trans) {
				return current.filter(trans.filter);
			}

			const copy = [...current];

			if ("remove" in trans) {
				copy.splice(copy.indexOf(trans.remove), 1);
			} else if ("insert" in trans) {
				copy.splice(trans.at, 0, trans.insert);
			} else if ("removeAt" in trans) {
				copy.splice(trans.removeAt, 1);
			} else if ("removeBy" in trans) {
				copy.splice(
					copy.findIndex((v) => getId(v) === trans.removeBy),
					1,
				);
			} else {
				console.assert("bad ArrayState transaction.");
			}

			return copy;
		});
		this.getId = getId;
	}

	getBy(id: Id) {
		return this.get().find((v) => this.getId(v) === id);
	}
}
