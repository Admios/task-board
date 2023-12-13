import { StateDTO } from "@/model/State";
import { clsx } from "clsx";
import { v4 as uuid } from "uuid";
import { KanbanColumn } from "./KanbanColumn";
import classes from "./KanbanColumnList.module.scss";
import { addStateDB } from "./kanbanActions";
import { Task, useZustand } from "./model";

type StateSeed = {
  name: StateDTO["name"];
  position: StateDTO["position"];
  color: StateDTO["color"];
};

const DEFAULT_STATES: StateSeed[] = [
  {
    name: "New",
    position: 0,
    color: "black",
  },
  {
    name: "In Progress",
    position: 1,
    color: "orange",
  },
  {
    name: "In Review",
    position: 2,
    color: "green",
  },
  {
    name: "Done",
    position: 3,
    color: "blue",
  },
];

async function createDefaultStates() {
  const { user, statesOrder, addState } = useZustand.getState();

  if (!user) {
    return;
  }

  if (statesOrder.length) {
    return;
  }

  const promises = DEFAULT_STATES.map(async (state) => {
    const item: StateDTO = {
      id: uuid(),
      name: state.name,
      color: state.color,
      position: state.position,
      owner: user.email,
    };
    addState(item);
    await addStateDB(item);
  });

  await Promise.all(promises);
}

interface KanbanColumnListProps {
  isStateDialogOpen: boolean;
  onOpenStateDialog(): void;
  onOpenCreateTaskModal(id: string): void;
  onOpenEditTaskModal(task: Task): void;
}

export function KanbanColumnList({
  isStateDialogOpen,
  onOpenStateDialog,
  onOpenEditTaskModal,
  onOpenCreateTaskModal,
}: KanbanColumnListProps) {
  const sortedStates = useZustand((store) => store.statesOrder);

  if (sortedStates.length < 1) {
    return (
      <div className={classes.emptyContainer}>
        <div className={clsx("card", classes.emptyContent)}>
          <header className="card-header">
            <p className="card-header-title">Your Workspace is empty!</p>
          </header>

          <div className="card-content">
            <div className="content">
              <p>
                You can create your first column, or create our default layout!
              </p>
            </div>
          </div>

          <footer className="card-footer">
            <a className="card-footer-item" onClick={onOpenStateDialog}>
              Create Column
            </a>
            <a className="card-footer-item" onClick={createDefaultStates}>
              Create Default Layout
            </a>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.columnList}>
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
