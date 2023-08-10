import { BasicState, IReadonlyState, IState, State } from "statec";
import { StateInitialProps } from "../../../util";
import { makeAPIRequest, UUID } from "../../../api";
import * as api from "."

type UserCredentials = StateInitialProps<api.User>;

export class UserImpl implements api.User {
	id: IReadonlyState<UUID>;
	username: IState<string>;
	email: IState<string>;

	constructor(data: UserCredentials) {
		this.id = new BasicState(data.id);
		this.username = new BasicState(data.username);
		this.email = new BasicState(data.email);
	}
}

export async function getUser(): Promise<api.User | null> {
	return new UserImpl({
		id: "-1",
		username: "ligman",
		email: "iknow@every.thing",
	});
	// return await makeAPIRequest("/user");
}

export async function authUser(
	username: string,
	password: string,
): Promise<api.User> {
	const response = await makeAPIRequest<api.User>("/auth", {
		username,
		password,
	});

	return response;
}
