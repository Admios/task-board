import { Box, Flex } from "@chakra-ui/react";
import { Empty } from "./Empty";
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
      <Empty
        isStateDialogOpen={isStateDialogOpen}
        onOpenStateDialog={onOpenStateDialog}
      />
    );
  }

  return (
    <Box overflowX="auto" height="92vh">
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
    </Box>
  );
}
