import React from "react";
import { Box, Button, Flex, Spacer, useDisclosure } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { Todo } from "./state";
import { EditTodoModal } from "./EditTodoModal/EditTodoModal";

export interface DraggedItemData {
  todo: Todo;
  columnFrom: string;
}

interface ItemProps {
  parentId: string;
  itemData: Todo;
  color: string;
}

export const Item: React.FC<ItemProps> = ({ parentId, itemData, color }) => {
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [{ isDragging }, drag] = useDrag<
    DraggedItemData,
    unknown,
    { isDragging: boolean }
  >(
    {
      type: "Todo",
      item: {
        columnFrom: parentId,
        todo: itemData,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    },
    [parentId, itemData],
  );

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
        <Box>{itemData.text}</Box>
        <Spacer />
        <Box>
          <Button onClick={() => setEditModalOpen(!editModalOpen)} bgColor={"blue.500"}>Edit</Button>
        </Box>
      </Flex>
      <EditTodoModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        todo={itemData}
      />
    </Box>
  );
};
