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
import { useZustand } from "./state";
import { moveTodoDB } from "./serverActions";
import { TaskDTO } from "@/model/Task";

interface ColumnProps {
  colTitle: string;
  color: string;
  colId: string;
  onOpenCreateTodoModal(): void;
}

export const Column: React.FC<ColumnProps> = ({
  colTitle,
  color,
  colId,
  onOpenCreateTodoModal,
}) => {
  const todoList = useZustand((store) => store.todos);
  const columnTodos = todoList.filter((todo) => todo.columnId === colId).sort((a, b) => a.position - b.position)
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
        
        moveTodoDB(todoList as TaskDTO[], columnFrom, colId, todo, position+1)
        moveTodo(columnFrom, colId, todo, position+1);
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
        {columnTodos.map((todo) => (
          <Item
            key={todo.id}
            parentId={colId}
            itemData={todo}
            color={color}
          />
        ))}
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
