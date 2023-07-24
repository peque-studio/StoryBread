import { BasicState, ConstState, IReadonlyState, IState, State } from "statec";
import { StateInitialProps } from "../../../util";
import * as api from ".";
import { API_PREFIX, makeAPIRequest } from "../../../api";

type UserCredentials = StateInitialProps<api.User>;
type ProjectData = StateInitialProps<api.Project>;

class ProjectImpl implements api.Project {
  id: IReadonlyState<api.UUID>;
  name: IState<string>;
  created: IReadonlyState<Date>;
  modified: IReadonlyState<Date>;
  background: IReadonlyState<string | undefined>;

  constructor(data: ProjectData) {
    this.id = new BasicState(data.id);
    this.name = new BasicState(data.name);
    this.created = new BasicState(data.created);
    this.modified = new BasicState(data.modified);
    this.background = new BasicState(data.background);
  }

  get link(): string {
    return `/project?id=${this.id}`;
  }

  async delete(): Promise<boolean> {
    return false;
  }
}

export class UserImpl implements api.User {
  id: IReadonlyState<api.UUID>;
  username: IState<string>;
  email: IState<string>;
  projects: IState<api.Project[], api.ProjectsTrans>;

  constructor(data: UserCredentials) {
    this.id = new BasicState(data.id);
    this.username = new BasicState(data.username);
    this.email = new BasicState(data.email);
    this.projects = new State(
      data.projects.map((p) => new ProjectImpl(p)),
      async (newProjectInfo, current) => {
        // const response = await fetch(`/api/project/new`);
        // current.push({ ...data });
        return current;
      }
    );
  }

  async getProjects(): Promise<IState<api.Project[], api.ProjectsTrans>> {
    if (this.id.get() === "-1")
      return new State(
        [
          new ProjectImpl({
            id: "deadf00d",
            name: "general",
            created: new Date(0),
            modified: new Date(0),
            background: undefined,
          }),
        ],
        async (newProjectInfo, current) => {
          try {
          } catch (e) {}

          return current;
          // return [
          //   ...current,
          //   await this.createNewProject(newProjectInfo)
          // ];
        } // todo: dunno whether i should create new project from user class
      );
    const projects = await makeAPIRequest<ProjectData[]>(`/project-list`);
    return new State(
      projects.map((p) => new ProjectImpl(p)),
      (from, to) => to
    );
  }

  private async createNewProject(): Promise<api.Project> {
    return {} as api.Project;
  }
}

export async function getUser(): Promise<api.User> {
  return new UserImpl({
    id: "-1",
    username: "ligman",
    email: "iknow@every.thing",
    projects: [],
  });
  return await makeAPIRequest(`/user`);
}
