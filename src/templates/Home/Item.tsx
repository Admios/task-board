import React from "react";
import { Box } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { Todo } from "./state";

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
    >
      {itemData.text}
    </Box>
  );
};
