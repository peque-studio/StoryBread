import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

const characters: Record<number, { name: string }> = {
  1: {
    name: "Kim Kitsuragi",
  },
  2: {
    name: "Klaasje Amandou",
  },
  3: {
    name: "Cuno",
  },
  4: {
    name: "Trant Heidelstam",
  },
  5: {
    name: "Jean Vicquemare",
  },
  6: {
    name: "Judit Minot",
  },
};

export function Library() {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over!.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(+active.id);
        const newIndex = items.indexOf(+over!.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <Card className="h-full w-1/4 rounded-none">
      <CardHeader>
        <CardTitle>Character library</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={sensors}
          collisionDetection={closestCenter}
        >
          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-3">
              {items.map((id) => (
                <CharacterCard key={id} id={id} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}

function CharacterCard({ id }: { id: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });
  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
    transition,
  };

  return (
    <div
      className="aspect-square rounded-md bg-neutral-800 flex-1/3 overflow-clip"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <img src={`https://cataas.com/cat?${id}`} className="aspect-video" />
      <p className="px-3 my-3">{characters[id].name}</p>
    </div>
  );
}
