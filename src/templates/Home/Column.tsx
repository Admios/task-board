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
import { useRef } from "react";
import { useDrop } from "react-dnd";
import { AddTodoModal } from "./AddTodoModal";
import { DraggedItemData, Item } from "./Item";
import { useZustand } from "./state";

interface ColumnProps {
  colTitle: string;
  color: string;
  colId: string;
}

export const Column: React.FC<ColumnProps> = ({ colTitle, color, colId }) => {
  const todoList = useZustand((store) => store.todos[colId]);
  const moveTodo = useZustand((store) => store.moveTodo);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dropRef = useRef(null);

  const [_, drop] = useDrop<DraggedItemData>(
    {
      accept: "Todo",
      canDrop: () => true,
      drop: ({ todo, columnFrom }, monitor) => {
        if (!dropRef.current) {
          return;
        }

        const cardBody: HTMLElement = dropRef.current;
        const numberOfChildren = cardBody.children.length;
        const dropPositionY: number | undefined = monitor.getClientOffset()?.y;

        let position = numberOfChildren;
        for (let i = 0; i < numberOfChildren; i++) {
          const itemBottomPosition =
            cardBody.children[i].getBoundingClientRect().bottom;
          if (
            dropPositionY !== undefined &&
            dropPositionY <= itemBottomPosition
          ) {
            position = i;
            break;
          }
        }

        moveTodo(todo, columnFrom, colId, position);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    },
    [todoList]
  );
  drop(dropRef);

  return (
    <>
      <AddTodoModal isOpen={isOpen} onClose={onClose} columnId={colId} />
      <Card bg={"gray.300"} mx={2} minW={350}>
        <CardHeader>
          <Center color={"gray.900"}>
            <Heading size={"md"}>{colTitle}</Heading>
          </Center>
        </CardHeader>
        <CardBody ref={dropRef}>
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
