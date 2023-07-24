import React from "react";
import "../../App.css";
import { Box } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { Todo } from "../../types";

interface ItemProps {
  itemKey: string;
  parentKey: string;
  itemData: { pos: number; text: string };
  color: string;
}

const Item: React.FC<ItemProps> = ({ itemKey, parentKey, itemData, color }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => {
    return {
      type: "TodoItem",
      item: { parent: parentKey, key: itemKey },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    };
  }, []);
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

export default Item;
