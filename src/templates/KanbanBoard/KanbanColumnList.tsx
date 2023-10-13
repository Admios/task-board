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
import { KanbanColumn } from "./KanbanColumn";
import { Task, useZustand } from "./model";

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
              You have no content yet. Create your first column with the button
              below!
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
