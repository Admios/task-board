import Column from "@/components/Column/Column";
import { useTodoList } from "@/context/TodoListContext";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

function ColumnSection() {
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
  return (
    <>
      {sortedColumns.map(([key, value]) => {
        return (
          <Column
            key={value.name}
            itemList={value.todo}
            colTitle={value.name}
            color={value.color}
          />
        );
      })}
    </>
  );
}

const Home = () => {
  const todosList = useTodoList();
  // const { addRandomTodos } = todosList;
  const router = useRouter();
  const handleLogout = async () => {
    router.push("/login");
  };

  return (
    <Box>
      <Box as="header">
        <Button colorScheme="blue" onClick={handleLogout}>
          Logout
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
        <ColumnSection />
      </Flex>
    </Box>
  );
};

export default Home;
