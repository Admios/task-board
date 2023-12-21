import { clsx } from "clsx";
import { useDrag } from "react-dnd";
import classes from "./KanbanItem.module.scss";
import { deleteTaskDB } from "./kanbanActions";
import { Task, useZustand } from "./model";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/16/solid";

export interface DraggedItemData {
  task: Task;
  stateFrom: string;
}

interface ItemProps {
  taskId: string;
  setTaskModalItem(task: Task): void;
}

export function KanbanItem({ taskId, setTaskModalItem }: ItemProps) {
  const itemData = useZustand((store) => store.tasks[taskId]);
  const deleteTask = useZustand((store) => store.deleteTask);

  const [{ isDragging }, drag] = useDrag<
    DraggedItemData,
    unknown,
    { isDragging: boolean }
  >(
    {
      type: "Task",
      item: {
        stateFrom: itemData.stateId,
        task: itemData,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    },
    [itemData],
  );

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    deleteTaskDB(id);
  };

  return (
    <article
      className={clsx(classes.container, isDragging && classes.halfOpacity)}
      title="task"
      ref={drag}
    >
      <p>{itemData?.text}</p>

      {/* Spacer to fill the empty space */}
      <div />

      <button onClick={() => setTaskModalItem(itemData)}>
        <PencilSquareIcon />
      </button>
      <button onClick={() => handleDeleteTask(itemData.id)}>
        <TrashIcon />
      </button>
    </article>
  );
}
