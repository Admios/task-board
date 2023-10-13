import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
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
  const states = useZustand((store) => store.states);
  const tasks = useZustand((store) => store.tasks);
  const [modals, dispatch] = useModalState();

  const sortedStates = useMemo(() => {
    return Object.values(states).sort(
      (valueA, valueB) => valueA.position - valueB.position,
    );
  }, [states]);

  const handleCreateRandomTasks = () => {
    if (!user) return;
    const randomTasks = new Set<string>();
    let firstState: StateType;

    if (!sortedStates.length) {
      firstState = {
        id: uuid(),
        name: "Random State",
        color: "black",
        position: 0,
        owner: user.email,
      };
      addStateDB(firstState);
      addState(firstState);
    } else {
      firstState = sortedStates[0];
    }

    let position = firstState.id in tasks ? tasks[firstState.id].length : 0;
    while (randomTasks.size < 10) {
      randomTasks.add(`Random Task ${Math.floor(Math.random() * 100)}`);
    }
    randomTasks.forEach((task) => {
      const newTask = {
        text: task,
        stateId: firstState.id,
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
          sortedStates={sortedStates}
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
