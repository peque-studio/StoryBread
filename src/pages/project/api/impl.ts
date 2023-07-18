import { Socket, io } from "socket.io-client";
import { Knot, KnotChoice, Project } from ".";
import { BasicState, IReadonlyState, IState, effectNow, lazyState } from "statec";
import { StateInitialProps, StatelessProps, arrayDiff } from "../../../util";
import ArrayState from "../arrayState";

type ApiProjectRequest = StateInitialProps<ProjectImpl>;

class ProjectImpl implements Project {
	id: IReadonlyState<string>;
	name: IState<string, string>;
	knots: ArrayState<Knot, string>;
	created: IReadonlyState<Date>;
	modified: IReadonlyState<Date>;

	private static createKnot(n: StatelessProps<Knot>): Knot {
		return {
			id: new BasicState(n.id),
			name: new BasicState(n.name),
			selected: new BasicState(n.selected),
			content: {
				text: new BasicState(n.content.text),
				dialogue: new ArrayState<string, string>([], (x) => x),
				choices: new ArrayState(
					n.content.choices.map(
						(c) =>
							<KnotChoice>{
								type: new BasicState(c.type),
								direction: c.direction,
								targetId: c.targetId,
							},
					),
					(choice) => choice.targetId,
				),
			},
			ui: { pos: new BasicState(n.ui.pos) },
		};
	}

	constructor(public socket: Socket, o: ApiProjectRequest) {
		this.id = new BasicState(o.id);
		this.name = new BasicState(o.name);
		this.knots = new ArrayState(o.knots.map(ProjectImpl.createKnot), (knot) =>
			knot.id.get(),
		);
		this.created = new BasicState(o.created);
		this.modified = new BasicState(o.modified);

		this.setupEffects();
	}

	deleteKnot(id: string): void {
		const knot = this.knots.getBy(id);
		if (!knot) return;

		const targetIds = knot.content.choices.get().map((c) => c.targetId);

		for (const targetId of targetIds) {
			const targetKnot = this.knots.getBy(targetId);
			if (!targetKnot) continue;

			targetKnot.content.choices.update({
				filter: ({ targetId }) => targetId !== knot.id.get(),
			});
		}

		// this is important, the choice ui won't be removed otherwise.
		// im not sure what to do about this, you can't really keep
		// track of created elements??
		knot.content.choices.update({ filter: () => false });
		this.knots.update({ removeBy: id });
		console.log(this.knots.get());
	}

	addKnot(x: number, y: number): Promise<Knot> {
		const knot: Knot = ProjectImpl.createKnot({
			content: {
				choices: [],
				dialogue: [],
				text: "",
			},
			id: Math.round(Math.random() * 1000).toString(),
			name: "Knot",
			selected: false,
			ui: { pos: { x, y } },
		});
		this.knots.update({ push: knot });
		return new Promise((resolve) => resolve(knot));
	}

	private setupEffects() {
		effectNow(this.knots, (knots, oldKnots) => {
			// TODO: removed?
			const { added, removed: _removed } = arrayDiff(
				knots,
				oldKnots ?? [],
				(a, b) => a.id === b.id,
			);
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
