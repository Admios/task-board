import { Navbar } from "@/components/Navbar";
import { clsx } from "clsx";
import { AddStateModal } from "./AddStateModal";
import { AddTaskModal } from "./AddTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { EmptyView } from "./EmptyView";
import { KanbanColumn } from "./KanbanColumn";
import styles from "./Layout.module.scss";
import { useZustand } from "./model";
import { useModalState } from "./useModalState";

export function Layout() {
  const user = useZustand((store) => store.user);
  const sortedStates = useZustand((store) => store.statesOrder);
  const [modals, dispatch] = useModalState();

  return (
    <section className={styles.container}>
      <Navbar
        user={user}
        onAddState={() => dispatch({ key: "ADD_STATE::OPEN" })}
      />

      <div className={clsx(styles.columnList, styles.content)}>
        {sortedStates.length < 1 ? (
          <EmptyView
            onOpenStateDialog={() => dispatch({ key: "ADD_STATE::OPEN" })}
          />
        ) : (
          sortedStates.map((stateId) => (
            <KanbanColumn
              key={stateId}
              stateId={stateId}
              onOpenCreateTaskModal={() =>
                dispatch({ key: "ADD_TASK::OPEN", payload: { stateId } })
              }
              setEditTaskModalItem={(task) =>
                dispatch({ key: "EDIT_TASK::OPEN", payload: { task } })
              }
            />
          ))
        )}
      </div>

      <AddStateModal
        isOpen={modals.addStateIsOpen}
        onClose={() => dispatch({ key: "ADD_STATE::CLOSE" })}
      />
      <AddTaskModal
        isOpen={!!modals.editingStateId}
        onClose={() => dispatch({ key: "ADD_TASK::CLOSE" })}
        stateId={modals.editingStateId}
      />
      <EditTaskModal
        isOpen={!!modals.editingTask}
        onClose={() => dispatch({ key: "EDIT_TASK::CLOSE" })}
        task={modals.editingTask}
      />
    </section>
  );
}
