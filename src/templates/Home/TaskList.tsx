import { Box, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { AddColumnModal } from "./AddColumnModal";
import { Column } from "./Column";
import { Header } from "./Header";
import { Column as ColumnType, Todo, useZustand } from "./state";
import { AddTodoModal } from "./AddTodoModal";
import { v4 as uuid } from "uuid";
import { EditTodoModal } from "./EditTodoModal";
import { addColumnDB, addTodoDB } from "./serverActions";

export function TaskList() {
  const user = useZustand((store) => store.user);
  const addColumn = useZustand((store) => store.addColumn);
  const addTodo = useZustand((store) => store.addTodo);
  const columns = useZustand((store) => store.columns);
  const todos = useZustand((store) => store.todos);
  const [addTodoModalColId, setTodoModalColId] = useState<string | undefined>();
  const [editTodoModalTodoId, setEditTodoModalTodo] = useState<Todo | undefined>();
  const {
    isOpen: isColumnDialogOpen,
    onOpen: onOpenColumnDialog,
    onClose: onCloseColumnDialog,
  } = useDisclosure();

  const sortedColumns = useMemo(() => {
    return Object.values(columns).sort(
      (valueA, valueB) => valueA.position - valueB.position,
    );
  }, [columns]);

  const handleCreateRandomTasks = () => {
    if (!user) return;
    const randomTasks = new Set<string>();
    let firstColumn: ColumnType;

    if (!sortedColumns.length) {
      firstColumn = {
        id: uuid(),
        name: "Random Column",
        color: "black",
        position: 0,
        owner: user.username,
      }
      addColumnDB(firstColumn);
      addColumn(firstColumn);
    } else {
      firstColumn = sortedColumns[0];
    }

    let position = firstColumn.id in todos ? todos[firstColumn.id].length : 0;
    while (randomTasks.size < 10) {
      randomTasks.add(`Random Task ${Math.floor(Math.random() * 100)}`);
    }
    randomTasks.forEach((task) => {
      const newTodo = {
        text: task,
        columnId: firstColumn.id,
        id: uuid(),
        position: position,
        owner: user.username,
      }
      addTodoDB(newTodo);
      addTodo(newTodo);
      position++;
    });
  };

  return (
    <Box margin="4">
      <Header
        handleCreateRandomTasks={handleCreateRandomTasks}
        onOpenColumnDialog={onOpenColumnDialog}
      />
      <Heading mx="auto" paddingBottom="2">
        Board
      </Heading>

      <Flex direction={"row"} gap="2">
        {sortedColumns.map((value) => (
          <Column
            key={value.name}
            colId={value.id}
            colTitle={value.name}
            color={value.color}
            onOpenCreateTodoModal={() => setTodoModalColId(value.id)}
            setEditTodoModalTodo={setEditTodoModalTodo}
          />
        ))}
      </Flex>

      <AddColumnModal
        isOpen={isColumnDialogOpen}
        onClose={onCloseColumnDialog}
      />
      <AddTodoModal
        isOpen={!!addTodoModalColId}
        onClose={() => setTodoModalColId(undefined)}
        columnId={addTodoModalColId}
      />
      <EditTodoModal
        isOpen={!!editTodoModalTodoId}
        onClose={() => setEditTodoModalTodo(undefined)}
        todo={editTodoModalTodoId}
      />
    </Box>
  );
}
