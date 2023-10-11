import {
  Box,
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
import { State as StateType, Task } from "./model";

interface KanbanColumnListProps {
  isStateDialogOpen: boolean;
  sortedStates: StateType[];
  onOpenStateDialog(): void;
  onOpenCreateTaskModal(id: string): void;
  onOpenEditTaskModal(task: Task): void;
}

export function KanbanColumnList({
  sortedStates,
  isStateDialogOpen,
  onOpenStateDialog,
  onOpenEditTaskModal,
  onOpenCreateTaskModal,
}: KanbanColumnListProps) {
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
          key={value.name}
          id={value.id}
          title={value.name}
          color={value.color}
          onOpenCreateTaskModal={() => onOpenCreateTaskModal(value.id)}
          setEditTaskModalItem={onOpenEditTaskModal}
        />
      ))}
    </Flex>
  );
}
