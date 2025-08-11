<h1 align="center">StoryBread</h1>

This is the monorepo for StoryBread, a web-based environment for worldbuilding.
Currently the project is at its early stages, so don't expect much!

## Planned Features

- A node-based dialogue tree editor, for example for story-driven games with branching narrative.
- Customizable table system, allowing you to visualize and edit complex relationships between characters, places, events, and anything else.
- Branching global timeline making it easier to keep track of different events and when they happen.
- A modular and customizable workspace.

## Current Tech Stack

Might change in the future as we develop the project.

Frontend/middle-end:

- TypeScript
- React
- Vite
- React Flow
- `shadcn/ui`
- Tanstack Router
- Tailwindcss
- Novel
- Lucide Icons
- DnD Kit

Backend

- Rust
- `axum`
- Postgres

## Getting Started

To get started with StoryBread follow the instructions below to set up the project on your local machine.

### Prerequisites

- Node.js
- pnpm

### Installation

```bash
git clone https://github.com/peque-studio/storybread.git
cd storybread
pnpm install
```

### Development

To start the development server:
```bash
pnpm dev
```

## Contributing

At this point it is better to open an issue if you find any bugs than to contribute directly, as the project structure is still work-in-progress. The exception is very small changes.

# License

The project is under the Mozilla Public License 2.0.
