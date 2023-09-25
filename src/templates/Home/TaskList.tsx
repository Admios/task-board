import { Box, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { AddColumnModal } from "./AddColumnModal";
import { Column } from "./Column";
import { Header } from "./Header";
import { Column as ColumnType, useZustand } from "./state";
import { AddTodoModal } from "./AddTodoModal";

export function TaskList() {
  const addColumn = useZustand((store) => store.addColumn);
  const addTodo = useZustand((store) => store.addTodo);
  const columns = useZustand((store) => store.columns);
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

    if (!sortedColumns.length) {
      firstColumn = addColumn({
        name: "Random Column",
        backendId: null,
        color: "black",
      });
    } else {
      firstColumn = sortedColumns[0];
    }

    while (randomTasks.size < 10) {
      randomTasks.add(`Random Task ${Math.floor(Math.random() * 100)}`);
    }

    randomTasks.forEach((task) =>
      addTodo({ text: task, columnId: firstColumn.id, backendId: null }),
    );
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
