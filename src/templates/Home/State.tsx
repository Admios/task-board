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
import { Todo, useZustand } from "./model";
import { moveTodoDB } from "./homeServerActions";

interface StateProps {
  title: string;
  color: string;
  id: string;
  onOpenCreateTodoModal(): void;
  setEditTodoModalTodo(todo: Todo): void;
}

export const State: React.FC<StateProps> = ({
  title,
  color,
  id,
  onOpenCreateTodoModal,
  setEditTodoModalTodo,
}) => {
  const todos = useZustand((store) => store.todos);
  const todoList = useZustand((store) => store.todos[id]);
  const moveTodo = useZustand((store) => store.moveTodo);
  const dropRef = useRef(null);

  const [_, drop] = useDrop<DraggedItemData>(
    {
      accept: "Todo",
      canDrop: () => true,
      drop: ({ todo, stateFrom }, monitor) => {
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
        const stateToTodos = id in todos ? todos[id] : [];
        const affectedTodos = [...todos[stateFrom], ...stateToTodos];
        moveTodoDB(affectedTodos, stateFrom, id, todo, position);
        moveTodo(todo, stateFrom, id, position);
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
    <Card bg={"gray.300"} minW={350} title={title}>
      <CardHeader>
        <Center color={"gray.900"}>
          <Heading size={"md"}>{title}</Heading>
        </Center>
      </CardHeader>

      <CardBody ref={dropRef}>
        {todoList
          ? todoList.map((value) => (
              <Item
                key={value?.id}
                parentId={id}
                itemData={value}
                color={color}
                setEditTodoModalTodo={setEditTodoModalTodo}
              />
            ))
          : null}
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
