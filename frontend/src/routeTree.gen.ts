/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as HomeRouteRouteImport } from './routes/home/route'
import { Route as EditorRouteRouteImport } from './routes/editor/route'
import { Route as IndexRouteRouteImport } from './routes/index/route'

const HomeRouteRoute = HomeRouteRouteImport.update({
  id: '/home',
  path: '/home',
  getParentRoute: () => rootRouteImport,
} as any)
const EditorRouteRoute = EditorRouteRouteImport.update({
  id: '/editor',
  path: '/editor',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRouteRoute = IndexRouteRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRouteRoute
  '/editor': typeof EditorRouteRoute
  '/home': typeof HomeRouteRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRouteRoute
  '/editor': typeof EditorRouteRoute
  '/home': typeof HomeRouteRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRouteRoute
  '/editor': typeof EditorRouteRoute
  '/home': typeof HomeRouteRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/editor' | '/home'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/editor' | '/home'
  id: '__root__' | '/' | '/editor' | '/home'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRouteRoute: typeof IndexRouteRoute
  EditorRouteRoute: typeof EditorRouteRoute
  HomeRouteRoute: typeof HomeRouteRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/home': {
      id: '/home'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof HomeRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/editor': {
      id: '/editor'
      path: '/editor'
      fullPath: '/editor'
      preLoaderRoute: typeof EditorRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRouteRoute: IndexRouteRoute,
  EditorRouteRoute: EditorRouteRoute,
  HomeRouteRoute: HomeRouteRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
