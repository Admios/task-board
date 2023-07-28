import { useTodoList } from "@/context/TodoListContext";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Column } from "./Column";

export const Home = () => {
  const todosList = useTodoList();
  const sortedColumns = useMemo(() => {
    return Object.entries({
      newCol: todosList.newCol,
      inProgressCol: todosList.inProgressCol,
      doneCol: todosList.doneCol,
      reviewCol: todosList.reviewCol,
    }).sort(([keyA, valueA], [keyB, valueB]) => {
      return valueA.pos - valueB.pos;
    });
  }, [todosList]);
  const router = useRouter();
  const handleLogout = async () => {
    router.push("/login");
  };

  return (
    <Box>
      <Box as="header">
        {/* <Button colorScheme="orange" onClick={() => addRandomTodos(10)}>
          Add +10 Todos
        </Button>
        <Button colorScheme="yellow" onClick={() => addRandomTodos(100)}>
          Add +100 Todos
        </Button> */}
        <Heading mx="auto">Board</Heading>
      </Box>
      <Flex direction={"row"}>
        {sortedColumns.map(([key, value]) => (
          <Column
            key={value.name}
            colId={key}
            itemList={value.todo}
            colTitle={value.name}
            color={value.color}
          />
        ))}
      </Flex>
    </Box>
  );
};
