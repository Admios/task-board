import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { v4 } from "uuid";
import { Column } from "./Column";
import { useZustand } from "./state";

export const Home = () => {
  const columns = useZustand((store) => store.columns);
  const addColumn = useZustand((store) => store.addColumn);
  const router = useRouter();

  const sortedColumns = useMemo(() => {
    return Object.values(columns).sort(
      (valueA, valueB) => valueA.position - valueB.position
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
        <Button
          colorScheme="blue"
          onClick={() => {
            addColumn(v4(), "jejejeje");
          }}
        >
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
    </Box>
  );
};
