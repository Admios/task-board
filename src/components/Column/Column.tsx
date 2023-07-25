import React, { useCallback, useState } from "react";
import Item from "../Item/Item";
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
import { useDrop } from "react-dnd";
import { useTodoList } from "../../context/TodoListContext";

interface ColumnProps {
  itemList: Todo;
  colTitle: string;
  color: string;
}

const Column: React.FC<ColumnProps> = ({ itemList, colTitle, color }) => {
  const todoList = useTodoList();
  const { todos, moveTodo } = todoList;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDrop = useCallback(
    (item: { key: string; parent: string }) => {
      moveTodo(colTitle, item);
    },
    [todos]
  );

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "TodoItem",
      canDrop: () => true,
      drop: (item: any) => {
        handleDrop(item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [todos]
  );

  return (
    <>
      <AddItemModal isOpen={isOpen} onClose={onClose} columnTitle={colTitle} />
      <Card bg={"gray.300"} mx={2} minW={350}>
        <CardHeader>
          <Center color={"gray.900"}>
            <Heading size={"md"}>{colTitle}</Heading>
          </Center>
        </CardHeader>
        <CardBody ref={drop}>
          {Object.keys(itemList).map((key) => (
            <Item
              key={key}
              itemKey={key}
              parentKey={colTitle}
              itemData={itemList[key]}
              color={color}
            />
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
