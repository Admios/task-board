import React from "react";
import { useDrag } from "react-dnd";
import { Task, useZustand } from "./model";
import { deleteTaskDB } from "./kanbanActions";
import classes from "./KanbanColumn.module.scss";
import { clsx } from "clsx";

export interface DraggedItemData {
  task: Task;
  stateFrom: string;
}

interface ItemProps {
  taskId: string;
  setTaskModalItem(task: Task): void;
}

export const KanbanItem: React.FC<ItemProps> = ({
  taskId,
  setTaskModalItem,
}) => {
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

  return (
    <article
      className={clsx(
        "box",
        { "--column-color": color },
        classes.container,
        isDragging && classes.halfOpacity,
      )}
      title="task"
    >
      <div className={classes.content}>
        <p>{itemData?.text}</p>

        <button onClick={() => setTaskModalItem(itemData)}>Edit</button>
        <button onClick={() => handleDeleteTask(itemData.id)}>Delete</button>
      </div>
    </article>
  );
};
