import { Box, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { AddStateModal } from "./AddStateModal";
import { AddTodoModal } from "./AddTodoModal";
import { EditTodoModal } from "./EditTodoModal";
import { Header } from "./Header";
import { State } from "./State";
import { addStateDB, addTodoDB } from "./homeServerActions";
import { State as StateType, Todo, useZustand } from "./model";

export function TaskList() {
  const user = useZustand((store) => store.user);
  const addState = useZustand((store) => store.addState);
  const addTodo = useZustand((store) => store.addTodo);
  const states = useZustand((store) => store.states);
  const todos = useZustand((store) => store.todos);
  const [addTodoModalColId, setTodoModalColId] = useState<string | undefined>();
  const [editTodoModalTodoId, setEditTodoModalTodo] = useState<
    Todo | undefined
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

    let position = firstState.id in todos ? todos[firstState.id].length : 0;
    while (randomTasks.size < 10) {
      randomTasks.add(`Random Task ${Math.floor(Math.random() * 100)}`);
    }
    randomTasks.forEach((task) => {
      const newTodo = {
        text: task,
        stateId: firstState.id,
        id: uuid(),
        position: position,
        owner: user.username,
      };
      addTodoDB(newTodo);
      addTodo(newTodo);
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
          <State
            key={value.name}
            id={value.id}
            title={value.name}
            color={value.color}
            onOpenCreateTodoModal={() => setTodoModalColId(value.id)}
            setEditTodoModalTodo={setEditTodoModalTodo}
          />
        ))}
      </Flex>

      <AddStateModal isOpen={isStateDialogOpen} onClose={onCloseStateDialog} />
      <AddTodoModal
        isOpen={!!addTodoModalColId}
        onClose={() => setTodoModalColId(undefined)}
        stateId={addTodoModalColId}
      />
      <EditTodoModal
        isOpen={!!editTodoModalTodoId}
        onClose={() => setEditTodoModalTodo(undefined)}
        todo={editTodoModalTodoId}
      />
    </Box>
  );
}
