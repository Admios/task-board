import React from "react";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { useDrag } from "react-dnd";
import { Task, useZustand } from "./model";
import { deleteTaskDB } from "./kanbanActions";

export interface DraggedItemData {
  task: Task;
  stateFrom: string;
}

interface ItemProps {
  taskId: string;
  setTaskModalItem(task: Task): void;
}

export const KanbanItem: React.FC<ItemProps> = ({
  taskId,
  setTaskModalItem,
}) => {
  const itemData = useZustand((store) => store.tasks[taskId]);
  const { color } = useZustand((store) => store.states[itemData.stateId]);
  const deleteTask = useZustand((store) => store.deleteTask);

  const [{ isDragging }, drag] = useDrag<
    DraggedItemData,
    unknown,
    { isDragging: boolean }
  >(
    {
      type: "Task",
      item: {
        stateFrom: itemData.stateId,
        task: itemData,
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    },
    [itemData],
  );

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    deleteTaskDB(id);
  };

  return (
    <Box
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      borderTop={`4px solid ${color}`}
      borderTopLeftRadius={2}
      borderTopRightRadius={2}
      color={"gray.600"}
      bg={"gray.200"}
      mt={2}
      p={2}
      title="task"
    >
      <Flex>
        <Box>{itemData?.text}</Box>
        <Spacer />
        <Box>
          <Button
            onClick={() => setTaskModalItem(itemData)}
            bgColor={"blue.500"}
          >
            Edit
          </Button>
        </Box>
        <Box>
          <Button
            onClick={() => handleDeleteTask(itemData.id)}
            bgColor={"red.500"}
          >
            Delete
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};
