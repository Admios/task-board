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
import { moveTaskDB } from "./homeServerActions";
import { Task, useZustand } from "./model";

interface StateProps {
  title: string;
  color: string;
  id: string;
  onOpenCreateTaskModal(): void;
  setEditTaskModalItem(task: Task): void;
}

export const State: React.FC<StateProps> = ({
  title,
  color,
  id,
  onOpenCreateTaskModal,
  setEditTaskModalItem,
}) => {
  const tasks = useZustand((store) => store.tasks);
  const taskList = useZustand((store) => store.tasks[id]);
  const moveTask = useZustand((store) => store.moveTask);
  const dropRef = useRef(null);

  const [_, drop] = useDrop<DraggedItemData>(
    {
      accept: "Task",
      canDrop: () => true,
      drop: ({ task, stateFrom }, monitor) => {
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
        const stateToTasks = id in tasks ? tasks[id] : [];
        const affectedTasks = [...tasks[stateFrom], ...stateToTasks];
        moveTaskDB(affectedTasks, stateFrom, id, task, position);
        moveTask(task, stateFrom, id, position);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    },
    [taskList],
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
        {taskList
          ? taskList.map((value) => (
              <Item
                key={value?.id}
                parentId={id}
                itemData={value}
                color={color}
                setTaskModalItem={setEditTaskModalItem}
              />
            ))
          : null}
      </CardBody>

      <CardFooter>
        <Center>
          <Button onClick={onOpenCreateTaskModal} bgColor={"blue.500"}>
            Add task
          </Button>
        </Center>
      </CardFooter>
    </Card>
  );
};
