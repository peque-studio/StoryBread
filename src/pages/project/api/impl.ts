import { Socket, io } from "socket.io-client";
import { IReadonlyState, IState, ArrayState, BasicState } from "../../../state";
import { Api } from "./api";
import { StateInitialProps } from "../../../util";

type ApiProjectRequest = StateInitialProps<Api.Project>;

class Project implements Api.Project {
	id: IReadonlyState<string>;
	name: IState<string, string>;
	nodes: ArrayState<Api.Node>;
	created: IReadonlyState<Date>;
	modified: IReadonlyState<Date>;

	constructor(public socket: Socket, o: ApiProjectRequest) {
		this.id = new BasicState(o.id);
		this.name = new BasicState(o.name);
		this.nodes = new ArrayState(
			o.nodes.map(
				(n) =>
					<Api.Node>{
						id: new BasicState(n.id),
						name: new BasicState(n.name),
						ui: { pos: new BasicState(n.ui.pos) },
					},
			),
		);
		this.created = new BasicState(o.created);
		this.modified = new BasicState(o.modified);
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
