import { AddStateModal } from "./AddStateModal";
import { AddTaskModal } from "./AddTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { Header } from "./Header";
import { KanbanColumnList } from "./KanbanColumnList";
import styles from "./Layout.module.scss";
import { useModalState } from "./useModalState";

export function Layout() {
  const [modals, dispatch] = useModalState();

  return (
    <section className={styles.container}>
      <Header onOpenStateDialog={() => dispatch({ key: "ADD_STATE::OPEN" })} />

      <div className={styles.content}>
        <KanbanColumnList
          isStateDialogOpen={modals.addStateIsOpen}
          onOpenStateDialog={() => dispatch({ key: "ADD_STATE::OPEN" })}
          onOpenEditTaskModal={(task) =>
            dispatch({ key: "EDIT_TASK::OPEN", payload: { task } })
          }
          onOpenCreateTaskModal={(stateId) =>
            dispatch({ key: "ADD_TASK::OPEN", payload: { stateId } })
          }
        />
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
