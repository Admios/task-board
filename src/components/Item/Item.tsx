import React from "react";
import "../../App.css";
import { Box } from "@chakra-ui/react";

interface ItemProps {
  data: string;
  color: string;
}

const Item: React.FC<ItemProps> = ({ data, color }) => {
  return (
    <Box
      borderTop={`4px solid ${color}`}
      borderTopLeftRadius={2}
      borderTopRightRadius={2}
      color={"gray.600"}
      bg={"gray.200"}
      mt={2}
      p={2}
    >
      {data}
    </Box>
  );
};

export default Item;
