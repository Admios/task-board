import { Column as DbColumn, Task as DbTask } from "@/model/types";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { AddColumnModal } from "./AddColumnModal";
import { Column } from "./Column";
import { useZustand } from "./state";

export interface HomeProps {
  initialColumns: DbColumn[];
  initialTasks: DbTask[];
}

export function TaskList({ initialColumns, initialTasks }: HomeProps) {
  const columns = useZustand((store) => store.columns);
  const {
    isOpen: isColumnDialogOpen,
    onOpen: onOpenColumnDialog,
    onClose: onCloseColumnDialog,
  } = useDisclosure();
  const router = useRouter();

  const sortedColumns = useMemo(() => {
    return Object.values(columns).sort(
      (valueA, valueB) => valueA.position - valueB.position,
    );
  }, [columns]);

  const handleLogout = async () => {
    router.push("/login");
  };

  return (
    <Box>
      <Box as="header">
        <Button colorScheme="blue" onClick={handleLogout}>
          Logout
        </Button>
        <Button colorScheme="blue" onClick={onOpenColumnDialog} marginLeft="2">
          Add Column
        </Button>
        {/* <Button colorScheme="orange" onClick={() => addRandomTodos(10)}>
          Add +10 Todos
        </Button>
        <Button colorScheme="yellow" onClick={() => addRandomTodos(100)}>
          Add +100 Todos
        </Button> */}
        <Heading mx="auto">Board</Heading>
      </Box>
      <Flex direction={"row"}>
        {sortedColumns.map((value) => (
          <Column
            key={value.name}
            colId={value.id}
            colTitle={value.name}
            color={value.color}
          />
        ))}
      </Flex>

      <AddColumnModal
        isOpen={isColumnDialogOpen}
        onClose={onCloseColumnDialog}
      />
    </Box>
  );
}
