import { Socket, io } from "socket.io-client";
import { Knot, KnotChoice, Project } from ".";
import {
	ArrayState,
	BasicState,
	IReadonlyState,
	IState,
	effectNow,
	lazyState,
} from "statec";
import { StateInitialProps, arrayDiff } from "../../../util";

type ApiProjectRequest = StateInitialProps<ProjectImpl>;

class ProjectImpl implements ProjectImpl {
	id: IReadonlyState<string>;
	name: IState<string, string>;
	knots: ArrayState<Knot>;
	created: IReadonlyState<Date>;
	modified: IReadonlyState<Date>;

	constructor(public socket: Socket, o: ApiProjectRequest) {
		this.id = new BasicState(o.id);
		this.name = new BasicState(o.name);
		this.knots = new ArrayState(
			o.knots.map(
				(n) =>
					<Knot>{
						id: new BasicState(n.id),
						name: new BasicState(n.name),
						selected: new BasicState(n.selected),
						content: {
							text: new BasicState(n.content.text),
							dialogue: new ArrayState<string>([]),
							choices: new ArrayState(
								n.content.choices.map(
									(c) =>
										<KnotChoice>{
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
		effectNow(this.knots, (knots, oldKnots) => {
			const { added } = arrayDiff(knots, oldKnots ?? [], (a, b) => a.id === b.id);
			for (const { item } of added) {
				this.setupKnotEffects(item);
			}
		});
	}

	private setupKnotEffects(knot: Knot) {
		lazyState(knot.ui.pos).effect((pos) => {
			this.socket.emit?.("knot-pos-update", knot.id, pos);
		});

		knot.name.effect((name) => {
			this.socket.emit?.("knot-name-update", knot.id, name);
		});
	}
}

/** the Project Api. */
export async function getProject(id: string): Promise<Project> {
	if (id === "test") {
		return new ProjectImpl({} as unknown as Socket, {
			id: "test",
			name: "Test Project",
			knots: [
				{
					id: "0",
					name: "Knot #1",
					selected: false,
					content: {
						text: "Hello, World! Lorem ipsum dolor sit amet",
						dialogue: [],
						choices: [
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
					name: "Knot #2",
					selected: false,
					content: {
						text: "Connect to me please :)",
						dialogue: [],
						choices: [
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
	return new ProjectImpl(io(`/project/${id}`), project);
}
