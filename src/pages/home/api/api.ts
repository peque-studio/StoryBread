import { IReadonlyState, IState } from "statec";

export declare namespace Api {
	export type UUID = string;

	export interface UserPreferences {
		name: IState<string>;
		id: IReadonlyState<UUID>;
	}

	export interface Project {
		name: IState<string>;
		id: IReadonlyState<UUID>;
		created: IReadonlyState<Date>;
		modified: IReadonlyState<Date>;

		/** Deletes this project. Forever :c */
		delete(): Promise<boolean>;
	}

	/** Info for a new project. */

	/** Info for a new project. */
	export interface NewProject {
		/** name for the new project. */
		name: string;
	}

	/** Get the list of all projects. */
	export function getProjects(): Promise<IState<Project[], NewProject>>;

	/** Get the user preferences. */
	export function getUserPrefs(project: Project): Promise<IState<UserPreferences>>;

	/** Get a link to the project page for `project` */
	export function getProjectLink(project: Project): string;
	export interface NewProject {
		/** name for the new project. */
		name: string;
	}

	/** Get the list of all projects. */
	export function getProjects(): Promise<IState<Project[], NewProject>>;

	/** Get the user preferences. */
	export function getUserPrefs(project: Project): Promise<IState<UserPreferences>>;

	/** Get a link to the project page for `project` */
	export function getProjectLink(project: Project): string;
}
