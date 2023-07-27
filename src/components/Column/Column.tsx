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
import { useMemo } from "react";

interface ColumnProps {
  itemList: Todo[];
  colTitle: string;
  color: string;
  colId: string;
}

const Column: React.FC<ColumnProps> = ({
  itemList,
  colTitle,
  color,
  colId,
}) => {
  const todoList = useTodoList();
  // const { todos, moveTodo } = todoList;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [{ isOver, canDrop }, drop] = useDrop(
    {
      accept: "TodoItem",
      canDrop: () => true,
      drop: (payload: { columnFrom: string; todo: Todo }) => {
        todoList.dispatch({
          type: "MOVE_TODO",
          payload: {
            columnTo: colId,
            columnFrom: payload.columnFrom,
            todo: payload.todo,
          },
        });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    },
    [todoList]
  );

  const sortedItems = useMemo(() => {
    return itemList.sort((a, b) => a.pos - b.pos);
  }, [itemList]);
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
          {sortedItems.map((value) => (
            <Item
              key={value.text}
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

export default Column;
