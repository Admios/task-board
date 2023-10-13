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
import { DraggedItemData, KanbanItem } from "./KanbanItem";
import { moveTaskDB } from "./kanbanActions";
import { Task, useZustand } from "./model";

interface KanbanColumnProps {
  stateId: string;
  onOpenCreateTaskModal(): void;
  setEditTaskModalItem(task: Task): void;
}

export function KanbanColumn({
  stateId,
  onOpenCreateTaskModal,
  setEditTaskModalItem,
}: KanbanColumnProps) {
  const state = useZustand((store) => store.states[stateId]);
  const tasksOrder = useZustand((store) => store.tasksOrder);
  const taskList = useZustand((store) => store.tasksOrder[stateId] ?? []);
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

        const { tasks } = useZustand.getState();
        const fromColumnTasksId = tasksOrder[stateFrom] ?? [];
        const toColumnTasksId = tasksOrder[stateId] ?? [];
        const affectedTasks = fromColumnTasksId
          .concat(toColumnTasksId)
          .map((id) => tasks[id]);
        moveTaskDB(affectedTasks, stateFrom, stateId, task, position);
        moveTask(task, stateFrom, stateId, position);
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
    <Card bg={"gray.300"} minW={350} title={state.name}>
      <CardHeader>
        <Center color={"gray.900"}>
          <Heading size={"md"}>{state.name}</Heading>
        </Center>
      </CardHeader>

      <CardBody ref={dropRef}>
        {taskList.map((value) => (
          <KanbanItem
            key={value}
            taskId={value}
            setTaskModalItem={setEditTaskModalItem}
          />
        ))}
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
}
