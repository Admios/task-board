import React, { useState } from "react";
import Item from "../Item/Item";
import "../../App.css";
import {
  Button,
  Center,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useDisclosure,
} from "@chakra-ui/react";
import AddItemModal from "../Modal/Modal";
import { Todo } from "../../types";

interface ColumnProps {
  itemList: Todo;
  colTitle: string;
  color: string;
}

const Column: React.FC<ColumnProps> = ({ itemList, colTitle, color }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <AddItemModal isOpen={isOpen} onClose={onClose} columnTitle={colTitle} />
      <Card bg={"gray.300"} mx={2} minW={350}>
        <CardHeader>
          <Center color={"gray.900"}>
            <Heading size={"md"}>{colTitle}</Heading>
          </Center>
        </CardHeader>
        <CardBody>
          {Object.keys(itemList).map((key) => (
            <Item key={key} data={itemList[key].text} color={color} />
          ))}
        </CardBody>
        <CardFooter>
          <Center>
            <Button onClick={onOpen} bgColor={"blue.500"}>
              Add task
            </Button>
          </Center>
        </CardFooter>
      </Card>
    </>
  );
};

export default Column;
