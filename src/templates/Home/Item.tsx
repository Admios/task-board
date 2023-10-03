import React from "react";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { Todo, useZustand } from "./model";
import { deleteTodoDB } from "./homeServerActions";

export interface DraggedItemData {
  todo: Todo;
  stateFrom: string;
}

interface ItemProps {
  parentId: string;
  itemData: Todo;
  color: string;
  setEditTodoModalTodo(todo: Todo): void;
}

export const Item: React.FC<ItemProps> = ({
  parentId,
  itemData,
  color,
  setEditTodoModalTodo,
}) => {
  const deleteTodo = useZustand((store) => store.deleteTodo);

  const [{ isDragging }, drag] = useDrag<
    DraggedItemData,
    unknown,
    { isDragging: boolean }
  >(
    {
      type: "Todo",
      item: {
        stateFrom: parentId,
        todo: itemData,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    },
    [parentId, itemData],
  );

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
    deleteTodoDB(id);
  };

  return (
    <Box
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      borderTop={`4px solid ${color}`}
      borderTopLeftRadius={2}
      borderTopRightRadius={2}
      color={"gray.600"}
      bg={"gray.200"}
      mt={2}
      p={2}
      title="task"
    >
      <Flex>
        <Box>{itemData?.text}</Box>
        <Spacer />
        <Box>
          <Button
            onClick={() => setEditTodoModalTodo(itemData)}
            bgColor={"blue.500"}
          >
            Edit
          </Button>
        </Box>
        <Box>
          <Button
            onClick={() => handleDeleteTodo(itemData.id)}
            bgColor={"red.500"}
          >
            Delete
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};
