import { clsx } from "clsx";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import classes from "./KanbanColumn.module.css";
import { DraggedItemData, KanbanItem } from "./KanbanItem";
import { moveTaskDB } from "./kanbanActions";
import { Task, useZustand } from "./model";

interface KanbanColumnProps {
  stateId: string;
  onOpenCreateTaskModal(): void;
  setEditTaskModalItem(task: Task): void;
}

export function KanbanColumn({
  stateId,
  onOpenCreateTaskModal,
  setEditTaskModalItem,
}: KanbanColumnProps) {
  const state = useZustand((store) => store.states[stateId]);
  const taskList = useZustand((store) => store.tasksOrder[stateId] ?? []);
  const dropRef = useRef(null);

  const [_, drop] = useDrop<DraggedItemData>(
    {
      accept: "Task",
      canDrop: () => true,
      drop: ({ task, stateFrom }, monitor) => {
        if (!dropRef.current) {
          return;
        }

        const cardBody: HTMLElement = dropRef.current;
        const numberOfChildren = cardBody.children.length;
        const dropPositionY: number | undefined = monitor.getClientOffset()?.y;

        let position = numberOfChildren;
        for (let i = 0; i < numberOfChildren; i++) {
          const itemBottomPosition =
            cardBody.children[i].getBoundingClientRect().bottom;
          if (
            dropPositionY !== undefined &&
            dropPositionY <= itemBottomPosition
          ) {
            position = i;
            break;
          }
        }

        const { tasks, tasksOrder, moveTask } = useZustand.getState();
        let affectedIds = tasksOrder[stateId] ?? [];
        if (stateFrom !== stateId) {
          const sourceTasksId = tasksOrder[stateFrom] ?? [];
          affectedIds = sourceTasksId.concat(affectedIds);
        }
        const affectedTasks = affectedIds.map((id) => tasks[id]);
        moveTaskDB(affectedTasks, stateFrom, stateId, task, position);
        moveTask(task, stateFrom, stateId, position);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    },
    [taskList],
  );
  drop(dropRef);

  // The color is added as a CSS variable to the entire column.
  const colorStyle = { "--column-color": state.color } as React.CSSProperties;

  return (
    <section className={clsx("card", classes.container)} style={colorStyle}>
      <header className="card-header">
        <p className="card-header-title">{state.name}</p>
      </header>

      <div className={clsx("card-content", classes.cardContent)} ref={dropRef}>
        {taskList.map((value) => (
          <KanbanItem
            key={value}
            taskId={value}
            setTaskModalItem={setEditTaskModalItem}
          />
        ))}
      </div>

      <footer className="card-footer">
        <a className="card-footer-item" onClick={onOpenCreateTaskModal}>
          Add task
        </a>
      </footer>
    </section>
  );
}
