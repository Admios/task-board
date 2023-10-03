import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import { DraggedItemData, Item } from "./Item";
import { Todo, useZustand } from "./state";
import { moveTodoDB } from "./homeServerActions";

interface ColumnProps {
  colTitle: string;
  color: string;
  colId: string;
  onOpenCreateTodoModal(): void;
  setEditTodoModalTodo(todo: Todo): void;
}

export const Column: React.FC<ColumnProps> = ({
  colTitle,
  color,
  colId,
  onOpenCreateTodoModal,
  setEditTodoModalTodo,
}) => {
  const todos = useZustand((store) => store.todos);
  const todoList = useZustand((store) => store.todos[colId]);
  const moveTodo = useZustand((store) => store.moveTodo);
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
        const columnToTodos = colId in todos ? todos[colId] : [];
        const affectedTodos = [...todos[columnFrom], ...columnToTodos];        
        moveTodoDB(affectedTodos, columnFrom , colId,todo, position);
        moveTodo(todo, columnFrom, colId, position);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    },
    [todoList],
  );
  drop(dropRef);

  return (
    <Card bg={"gray.300"} minW={350} title={colTitle}>
      <CardHeader>
        <Center color={"gray.900"}>
          <Heading size={"md"}>{colTitle}</Heading>
        </Center>
      </CardHeader>

      <CardBody ref={dropRef}>
        {todoList ? todoList.map((value) => (
          <Item
            key={value?.id}
            parentId={colId}
            itemData={value}
            color={color}
            setEditTodoModalTodo={setEditTodoModalTodo}
          />
        )) : null}
      </CardBody>

      <CardFooter>
        <Center>
          <Button onClick={onOpenCreateTodoModal} bgColor={"blue.500"}>
            Add task
          </Button>
        </Center>
      </CardFooter>
    </Card>
  );
};
