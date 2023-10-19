import { StateDTO } from "@/model/State";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { KanbanColumn } from "./KanbanColumn";
import { addStateDB } from "./kanbanActions";
import { Task, useZustand } from "./model";

type StateSeed = {
  name: StateDTO["name"];
  position: StateDTO["position"];
  color: StateDTO["color"];
};

const DEFAULT_STATES: StateSeed[] = [
  {
    name: "New",
    position: 0,
    color: "black",
  },
  {
    name: "In Progress",
    position: 1,
    color: "orange",
  },
  {
    name: "In Review",
    position: 2,
    color: "green",
  },
  {
    name: "Done",
    position: 3,
    color: "blue",
  },
];

async function createDefaultStates() {
  const { user, statesOrder, addState } = useZustand.getState();

  if (!user) {
    return;
  }

  if (statesOrder.length) {
    return;
  }

  const promises = DEFAULT_STATES.map(async (state) => {
    const item: StateDTO = {
      id: uuid(),
      name: state.name,
      color: state.color,
      position: state.position,
      owner: user.email,
    };
    addState(item);
    await addStateDB(item);
  });

  await Promise.all(promises);
}

interface KanbanColumnListProps {
  isStateDialogOpen: boolean;
  onOpenStateDialog(): void;
  onOpenCreateTaskModal(id: string): void;
  onOpenEditTaskModal(task: Task): void;
}

export function KanbanColumnList({
  isStateDialogOpen,
  onOpenStateDialog,
  onOpenEditTaskModal,
  onOpenCreateTaskModal,
}: KanbanColumnListProps) {
  const sortedStates = useZustand((store) => store.statesOrder);

  if (sortedStates.length < 1) {
    return (
      <Center width="100%" height="100%">
        <Card margin="16">
          <CardHeader>
            <Heading size="md">Your workspace is empty!</Heading>
          </CardHeader>

          <CardBody>
            <Text>
              You have no content yet. Create your first column, or create our
              default layout!
            </Text>
          </CardBody>

          <CardFooter display="flex" gap="8">
            <Button
              colorScheme="blue"
              onClick={onOpenStateDialog}
              disabled={isStateDialogOpen}
            >
              Create Column
            </Button>
            <Button
              colorScheme="blue"
              onClick={createDefaultStates}
              disabled={isStateDialogOpen}
            >
              Create Default Layout
            </Button>
          </CardFooter>
        </Card>
      </Center>
    );
  }

  return (
    <Flex margin={4} direction="row" gap="2">
      {sortedStates.map((value) => (
        <KanbanColumn
          key={value}
          stateId={value}
          onOpenCreateTaskModal={() => onOpenCreateTaskModal(value)}
          setEditTaskModalItem={onOpenEditTaskModal}
        />
      ))}
    </Flex>
  );
}
