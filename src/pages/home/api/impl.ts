import { IReadonlyState, IState } from "statec"
import { StateInitialProps } from "../../../util";

type UserIdType = string // todo: think about type

interface User {
    id: UserIdType
    username: string
    email: string
    projects: Project[]
}

type ApiProjectsRequest = StateInitialProps<ProjectImpl>

class ProjectImpl implements ProjectImpl {
    id: IReadonlyState<string>;
    name: IState<string, string>;
    created: IReadonlyState<Date>;
    modified: IReadonlyState<Date>;

    private fetchBackgroundImage() {
        fetch(`/api/project/${id}`)
    }
}

export async function getProjects(userId: UserIdType): Promise<Project> {
    if (userId === "-1") {

    }
}