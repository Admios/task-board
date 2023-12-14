import { AddStateModal } from "./AddStateModal";
import { AddTaskModal } from "./AddTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { EmptyView } from "./EmptyView";
import { KanbanColumnList } from "./KanbanColumnList";
import styles from "./Layout.module.scss";
import { Navbar } from "./Navbar";
import { useModalState } from "./useModalState";

export function Layout() {
  const [modals, dispatch] = useModalState();

  return (
    <section className={styles.container}>
      <Navbar onOpenStateDialog={() => dispatch({ key: "ADD_STATE::OPEN" })} />

      <div className={styles.content}>
        <KanbanColumnList
          onOpenEditTaskModal={(task) =>
            dispatch({ key: "EDIT_TASK::OPEN", payload: { task } })
          }
          onOpenCreateTaskModal={(stateId) =>
            dispatch({ key: "ADD_TASK::OPEN", payload: { stateId } })
          }
        >
          <EmptyView
            onOpenStateDialog={() => dispatch({ key: "ADD_STATE::OPEN" })}
            isStateDialogOpen={modals.addStateIsOpen}
          />
        </KanbanColumnList>
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
