import { PropsWithChildren } from "react";
import { KanbanColumn } from "./KanbanColumn";
import classes from "./KanbanColumnList.module.scss";
import { Task, useZustand } from "./model";
import { clsx } from "clsx";

interface KanbanColumnListProps {
  className?: string;
  onOpenCreateTaskModal(id: string): void;
  onOpenEditTaskModal(task: Task): void;
}

export function KanbanColumnList({
  className,
  children,
  onOpenEditTaskModal,
  onOpenCreateTaskModal,
}: PropsWithChildren<KanbanColumnListProps>) {
  const sortedStates = useZustand((store) => store.statesOrder);

  // Show the empty view if there are no columns
  if (sortedStates.length < 1) {
    return children;
  }

  return (
    <div className={clsx(classes.columnList, className)}>
      {sortedStates.map((value) => (
        <KanbanColumn
          key={value}
          stateId={value}
          onOpenCreateTaskModal={() => onOpenCreateTaskModal(value)}
          setEditTaskModalItem={onOpenEditTaskModal}
        />
      ))}
    </div>
  );
}
