import { Box } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { AddStateModal } from "./AddStateModal";
import { AddTaskModal } from "./AddTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { Header } from "./Header";
import { KanbanColumnList } from "./KanbanColumnList";
import { addStateDB, addTaskDB } from "./kanbanActions";
import { State as StateType, useZustand } from "./model";
import { useModalState } from "./useModalState";

export function Layout() {
  const user = useZustand((store) => store.user);
  const addState = useZustand((store) => store.addState);
  const addTask = useZustand((store) => store.addTask);
  const [modals, dispatch] = useModalState();

  const handleCreateRandomTasks = () => {
    if (!user) return;

    const sortedStates = useZustand.getState().statesOrder;
    const randomTasks = new Set<string>();
    let firstStateId: string;

    if (!sortedStates.length) {
      firstStateId = uuid();
      const item: StateType = {
        id: firstStateId,
        name: "Random State",
        color: "black",
        position: 0,
        owner: user.email,
      };
      addStateDB(item);
      addState(item);
    } else {
      firstStateId = sortedStates[0];
    }

    while (randomTasks.size < 10) {
      randomTasks.add(`Random Task ${Math.floor(Math.random() * 100)}`);
    }

    let position = sortedStates.length ?? 0;
    randomTasks.forEach((task) => {
      const newTask = {
        text: task,
        stateId: firstStateId,
        id: uuid(),
        position: position,
        owner: user.email,
      };
      addTaskDB(newTask);
      addTask(newTask);
      position++;
    });
  };

  return (
    <Box display="flex" flexFlow="column" height="100vh">
      <Header
        handleCreateRandomTasks={handleCreateRandomTasks}
        onOpenStateDialog={() => dispatch({ key: "ADD_STATE::OPEN" })}
      />

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
