namespace Api {
	export type UUID = string;

	export interface Project {
		name: string;
		id: UUID;
		created: Date;
		modified: Date;
	}
}
