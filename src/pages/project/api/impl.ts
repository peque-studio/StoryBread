import { Socket, io } from "socket.io-client";
import {
	IReadonlyState,
	IState,
	ArrayState,
	BasicState,
	effectNow,
	lazyState,
} from "../../../state";
import { Api } from "./api";
import { StateInitialProps, arrayDiff } from "../../../util";

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
						content: {
							text: new BasicState(n.content.text),
							connectsTo: new ArrayState(
								n.content.connectsTo.map(
									(c) =>
										<Api.NodeConnection>{
											type: new BasicState(c.type),
											direction: c.direction,
											targetId: c.targetId,
										},
								),
							),
						},
						ui: { pos: new BasicState(n.ui.pos) },
					},
			),
		);
		this.created = new BasicState(o.created);
		this.modified = new BasicState(o.modified);

		this.setupEffects();
	}

	private setupEffects() {
		effectNow(this.nodes, (nodes, oldNodes) => {
			const { added } = arrayDiff(nodes, oldNodes ?? [], (a, b) => a.id === b.id);
			for (const { item } of added) {
				this.setupNodeEffects(item);
			}
		});
	}

	private setupNodeEffects(node: Api.Node) {
		lazyState(node.ui.pos).effect((pos) => {
			this.socket.emit?.("node-pos-update", node.id, pos);
		});

		node.name.effect((name) => {
			this.socket.emit?.("node-name-update", node.id, name);
		});
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
					content: {
						text: "Hello, World! Lorem ipsum dolor sit amet",
						connectsTo: [
							{
								type: "direct",
								direction: "forward",
								targetId: "1",
							},
						],
					},
					ui: { pos: { x: 80, y: 80 } },
				},
				{
					id: "1",
					name: "Node #2",
					content: {
						text: "Connect to me please :)",
						connectsTo: [
							{
								type: "direct",
								direction: "backward",
								targetId: "0",
							},
						],
					},
					ui: { pos: { x: 300, y: 90 } },
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
