import { Socket, io } from "socket.io-client";
import { IReadonlyState, IState, ArrayState, BasicState } from "../../state";
import { Api } from "./api";

type ApiProjectRequest = { [key in keyof Api.Project]: Api.Project[key] extends IReadonlyState<infer T> ? T : never };

class Project implements Api.Project {
	id: IReadonlyState<string>;
	name: IState<string, string>;
	nodes: ArrayState<Api.Node>;
	created: IReadonlyState<Date>;
	modified: IReadonlyState<Date>;
	
	constructor(public socket: Socket, o: ApiProjectRequest) {
		this.id = new BasicState<string>(o.id);
		this.name = new BasicState<string>(o.name);
		this.nodes = new ArrayState<Api.Node>(o.nodes);
		this.created = new BasicState<Date>(o.created);
		this.modified = new BasicState<Date>(o.modified);
	}
}

export async function getProject(id: string): Promise<Project> {
	const response = await fetch(`/api/project/${id}`);
	const project = await response.json() as ApiProjectRequest;
	return new Project(io(`/project/${id}`), project);
}


