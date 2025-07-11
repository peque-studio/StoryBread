import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { ActionNode } from "./-types";

interface EditorState {
  activeNodes: ActionNode[];
  setActiveNodes: (nodes: ActionNode[]) => void;
  resetActiveNodes: () => void;
}

export const useEditorStore = create<EditorState>()(
  devtools((set) => ({
    activeNodes: [],
    setActiveNodes: (nodes) => set(() => ({ activeNodes: nodes })),
    resetActiveNodes: () => set(() => ({ activeNodes: [] })),
  }))
);
