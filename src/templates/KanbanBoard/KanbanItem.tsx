import { clsx } from "clsx";
import { useDrag } from "react-dnd";
import classes from "./KanbanItem.module.scss";
import { deleteTaskDB } from "./kanbanActions";
import { Task, useZustand } from "./model";

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
  const { color } = useZustand((store) => store.states[itemData.stateId]);
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

  // The color is added as a CSS variable to the article element
  const colorStyle = { "--column-color": color } as React.CSSProperties;

  return (
    <article
      style={colorStyle}
      className={clsx(classes.container, isDragging && classes.halfOpacity)}
      title="task"
      ref={drag}
    >
      <p>{itemData?.text}</p>

      <button onClick={() => setTaskModalItem(itemData)}>Edit</button>
      <button onClick={() => handleDeleteTask(itemData.id)}>Delete</button>
    </article>
  );
}
