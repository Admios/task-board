import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { AddTodoModal } from "./AddTodoModal";
import { DraggedItemData, Item } from "./Item";
import { ColumnId, useZustand } from "./state";

interface ColumnProps {
  colTitle: string;
  color: string;
  colId: ColumnId;
}

export const Column: React.FC<ColumnProps> = ({ colTitle, color, colId }) => {
  const todoList = useZustand((store) => store[colId]);
  const moveTodo = useZustand((store) => store.moveTodo);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [_, drop] = useDrop<DraggedItemData>(
    {
      accept: "Todo",
      canDrop: () => true,
      drop: ({ todo, columnFrom }) => {
        moveTodo(todo, columnFrom, colId);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    },
    [todoList]
  );

  return (
    <>
      <AddTodoModal isOpen={isOpen} onClose={onClose} columnId={colId} />
      <Card bg={"gray.300"} mx={2} minW={350}>
        <CardHeader>
          <Center color={"gray.900"}>
            <Heading size={"md"}>{colTitle}</Heading>
          </Center>
        </CardHeader>
        <CardBody ref={drop}>
          {todoList.map((value) => (
            <Item
              key={value.id}
              parentId={colId}
              itemData={value}
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
