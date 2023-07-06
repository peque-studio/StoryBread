import { Socket, io } from "socket.io-client";
import { IReadonlyState, IState, ArrayState, BasicState } from "../../../state";
import { Api } from "./api";

type Primitive = bigint | boolean | null | number | string | symbol | undefined | Date | Function;

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

type StateInitialProps<T> = {
	[P in keyof T as IsStateful_<P, T[P]>]: ToStateless_<T[P]>;
};

type StatelessProps<T> = {
	[P in keyof T]: ToStateless_<T[P]>;
};

type ApiProjectRequest = StateInitialProps<Api.Project>;

class Project implements Api.Project {
	id: IReadonlyState<string>;
	name: IState<string, string>;
	nodes: ArrayState<Api.Node>;
	created: IReadonlyState<Date>;
	modified: IReadonlyState<Date>;

	constructor(public socket: Socket, o: ApiProjectRequest) {
		this.id = new BasicState<string>(o.id);
		this.name = new BasicState<string>(o.name);
		this.nodes = new ArrayState<Api.Node>(
			o.nodes.map((n) => ({
				id: new BasicState(n.id),
				name: new BasicState(n.name),
				ui: { pos: new BasicState(n.ui.pos) },
			})),
		);
		this.created = new BasicState<Date>(o.created);
		this.modified = new BasicState<Date>(o.modified);
	}
}

export async function getProject(id: string): Promise<Project> {
	if (id === "test") {
		return new Project({} as unknown as Socket, {
			id: "test",
			name: "Test Project",
			nodes: [
				{
					id: "0",
					name: "Node #1",
					ui: { pos: { x: 10, y: 20 } },
				},
			],
			created: new Date(),
			modified: new Date(),
		});
	}
	const response = await fetch(`/api/project/${id}`);
	const project = (await response.json()) as ApiProjectRequest;
	return new Project(io(`/project/${id}`), project);
}
