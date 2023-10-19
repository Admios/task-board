import { Box } from "@chakra-ui/react";
import { AddStateModal } from "./AddStateModal";
import { AddTaskModal } from "./AddTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { Header } from "./Header";
import { KanbanColumnList } from "./KanbanColumnList";
import { useModalState } from "./useModalState";

export function Layout() {
  const [modals, dispatch] = useModalState();

  return (
    <Box display="flex" flexFlow="column" height="100vh">
      <Header onOpenStateDialog={() => dispatch({ key: "ADD_STATE::OPEN" })} />

      <Box overflowX="auto" flex="1">
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
      </Box>

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
    </Box>
  );
}
