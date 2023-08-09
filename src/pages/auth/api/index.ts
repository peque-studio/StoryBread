import { IReadonlyState, IState } from "statec";
import { UUID } from "../../../api";

export interface User {
	id: IReadonlyState<UUID>;
	username: IState<string>;
	email: IState<string>;
}

export { getUser, authUser } from "./impl";