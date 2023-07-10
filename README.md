# StoryBread

> TODO! WIP! Not finished! etc.

## Architecture

### Home

The home page has a list of projects, `fetch`ed from the server.

### Project

The project page opens a websocket connection.

## TODO

- [ ] Understand Frontend/Backend structure.
  e.g. how does the backend invoke the bundler for the frontend? etc.
- [ ] Make this repo a monorepo with `backend`, `frontend` and `common` packages.
- [ ] Put the git pre-commit hook somewhere so it works for everyone. (invokes Rome's formatter)

### Frontend

- [ ] Fix/unify styling.
- [ ] Come up with a global styling thing.

#### Pages/Project

- [ ] Add collaborative editing with prosemirror.
- [ ] Make the 'Add Node' button work.
- [ ] Implement all of the "state updates -> socket.io messages" logic.
- [ ] Take the project id from the url query params.
- [ ] Add an 'Export'. (fetch from `/api/export?id=<...>`)
- [ ] Fix prosemirror styling.

#### Pages/Home

- [ ] Add API definitions.
- [ ] Add project list. (from `/api/projects`, each item is a link to `/project?id=<...>`)
- [ ] Add a `Create Project` button. (state update -> post to `/api/create-project`)
- [ ] Add session preferences (name, etc.) (state update -> post to `/api/prefs`)
- [ ] Implement all of the "state updates -> fetch" logic.

### Backend

> Roughly in order

- [ ] Implement the static routes. (`/`, `/project`)
- [ ] Implement the REST backend (`/api/`)
- [ ] Implement the WS backend (socket.io?)