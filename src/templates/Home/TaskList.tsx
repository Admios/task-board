import { Box, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { AddColumnModal } from "./AddColumnModal";
import { Column } from "./Column";
import { Header } from "./Header";
import { Column as ColumnType, useZustand } from "./state";
import { AddTodoModal } from "./AddTodoModal";
import { v4 as uuid } from "uuid";
import { addColumnDB, addTodoDB } from "./serverActions";

export function TaskList() {
  const addColumn = useZustand((store) => store.addColumn);
  const addTodo = useZustand((store) => store.addTodo);
  const columns = useZustand((store) => store.columns);
  const todos = useZustand((store) => store.todos);
  const columnTodos = useZustand((store) => store.todos.filter((todo) => todo.columnId === columns[0]?.id));
  const [addTodoModalColId, setTodoModalColId] = useState<string | undefined>();
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
    const randomTasks = new Set<string>();
    let firstColumn: ColumnType;

    if (!columns.length) {
      const newColumn = {
        name: "Random Column",
        color: "black",
        id: uuid(),
        position: columns.length + 1,
      };
      addColumnDB(newColumn);
      firstColumn = addColumn(newColumn);
    } else {
      firstColumn = sortedColumns[0];
    }

    while (randomTasks.size < 10) {
      randomTasks.add(`Random Task ${Math.floor(Math.random() * 100)}`);
    }

    let position = columnTodos.length;

    randomTasks.forEach((task) => {
      const newTodo = {
        text: task, columnId: firstColumn.id,
        id: uuid(),
        position,
      }
      position += 1;
      addTodoDB(newTodo);
      addTodo(newTodo);
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
        {sortedColumns.map((column) => (
          <Column
            key={column.name}
            colId={column.id}
            colTitle={column.name}
            color={column.color}
            onOpenCreateTodoModal={() => setTodoModalColId(column.id)}
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
    </Box>
  );
}
