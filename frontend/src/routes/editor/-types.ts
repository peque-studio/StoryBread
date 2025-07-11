import type { Node } from "@xyflow/react";

export interface ActionNode extends Node {
  data: {
    label: string;
  };
}
