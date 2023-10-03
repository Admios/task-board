import { Box, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { AddStateModal } from "./AddStateModal";
import { AddTaskModal } from "./AddTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { Header } from "./Header";
import { KanbanColumn } from "./KanbanColumn";
import { addStateDB, addTaskDB } from "./kanbanActions";
import { State as StateType, Task, useZustand } from "./model";

export function Layout() {
  const user = useZustand((store) => store.user);
  const addState = useZustand((store) => store.addState);
  const addTask = useZustand((store) => store.addTask);
  const states = useZustand((store) => store.states);
  const tasks = useZustand((store) => store.tasks);
  const [addTaskModalStateId, setStaskModalStateId] = useState<
    string | undefined
  >();
  const [editTaskModalTaskId, setEditTaskModalTaskId] = useState<
    Task | undefined
  >();
  const {
    isOpen: isStateDialogOpen,
    onOpen: onOpenStateDialog,
    onClose: onCloseStateDialog,
  } = useDisclosure();

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
        owner: user.username,
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
        owner: user.username,
      };
      addTaskDB(newTask);
      addTask(newTask);
      position++;
    });
  };

  return (
    <Box margin="4">
      <Header
        handleCreateRandomTasks={handleCreateRandomTasks}
        onOpenStateDialog={onOpenStateDialog}
      />
      <Heading mx="auto" paddingBottom="2">
        Board
      </Heading>

      <Flex direction={"row"} gap="2">
        {sortedStates.map((value) => (
          <KanbanColumn
            key={value.name}
            id={value.id}
            title={value.name}
            color={value.color}
            onOpenCreateTaskModal={() => setStaskModalStateId(value.id)}
            setEditTaskModalItem={setEditTaskModalTaskId}
          />
        ))}
      </Flex>

      <AddStateModal isOpen={isStateDialogOpen} onClose={onCloseStateDialog} />
      <AddTaskModal
        isOpen={!!addTaskModalStateId}
        onClose={() => setStaskModalStateId(undefined)}
        stateId={addTaskModalStateId}
      />
      <EditTaskModal
        isOpen={!!editTaskModalTaskId}
        onClose={() => setEditTaskModalTaskId(undefined)}
        task={editTaskModalTaskId}
      />
    </Box>
  );
}
