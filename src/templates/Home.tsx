import Column from "@/components/Column/Column";
import { useTodoList } from "@/context/TodoListContext";
import { logout } from "@/firebase/firebase";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

function ColumnSection() {
  const todosList = useTodoList();
  const { todos } = todosList;
  const sortedColumns = Object.entries(todos).sort(
    ([keyA, valueA], [keyB, valueB]) => valueA.pos - valueB.pos
  );
  return (
    <>
      {sortedColumns.map(([key, value]) => {
        const sortedTodos = Object.entries(value.todo).sort(
          ([todoKeyA, todoValueA], [todoKeyB, todoValueB]) =>
            todoValueA.pos - todoValueB.pos
        );

        return (
          <Column
            key={key}
            itemList={Object.fromEntries(sortedTodos)}
            colTitle={key}
            color={value.color}
          />
        );
      })}
    </>
  );
}

const Home = () => {
  const todosList = useTodoList();
  const { addRandomTodos } = todosList;
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <Box>
      <Box as="header">
        <Button colorScheme="blue" onClick={handleLogout}>
          Logout
        </Button>
        <Button colorScheme="orange" onClick={() => addRandomTodos(10)}>
          Add +10 Todos
        </Button>
        <Button colorScheme="yellow" onClick={() => addRandomTodos(100)}>
          Add +100 Todos
        </Button>
        <Heading mx="auto">Board</Heading>
      </Box>
      <Flex direction={"row"}>
        <ColumnSection />
      </Flex>
    </Box>
  );
};

export default Home;
