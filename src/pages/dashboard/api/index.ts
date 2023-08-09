import { IReadonlyState, IState } from "statec";
import { UUID } from "../../../api";
import { StateInitialProps } from "../../../util";

export type ProjectsTrans = { new: { name: string } } | { delete: { id: UUID } }; // delete forver :c

export interface User {
	id: IReadonlyState<UUID>;
	username: IState<string>;
	email: IState<string>;
	projects: IState<Project[], ProjectsTrans>
}

export interface UserPreferences {
	name: IState<string>;
	id: IReadonlyState<UUID>;
}

export interface Project {
	name: IState<string>;
	id: IReadonlyState<UUID>;
	created: IReadonlyState<Date>;
	modified: IReadonlyState<Date>;
	/** doxx url */
	background: IReadonlyState<string | undefined>;
	/** Get a link to the project page for `project` */
	get link(): string;
}

/** Info for a new project. */
export interface NewProject {
	/** name for the new project. */
	name: string;
}

export type ProjectData = StateInitialProps<Project>;