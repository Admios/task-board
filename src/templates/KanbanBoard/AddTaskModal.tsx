import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { KeyboardEventHandler, useState } from "react";
import { useZustand } from "./model";
import { v4 as uuid } from "uuid";
import { addTaskDB } from "./kanbanActions";

interface AddModalProps {
  stateId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddTaskModal({ isOpen, onClose, stateId }: AddModalProps) {
  const user = useZustand((store) => store.user);
  const taskList = useZustand((store) =>
    stateId ? store.tasks[stateId] : undefined,
  );
  const addTask = useZustand((store) => store.addTask);
  const [title, setTitle] = useState("");
  const isError = title === "";

  const handleAddTask = () => {
    if (!user || !stateId) return;
    const newTask = {
      text: title,
      stateId,
      id: uuid(),
      position: taskList ? taskList.length : 0,
      owner: user.username,
    };
    addTaskDB(newTask);
    addTask(newTask);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTitle("");
  };

  const submitOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && !isError) {
      handleAddTask();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={isError}>
            <FormLabel>Task:</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyUp={submitOnEnter}
              autoFocus
            />

            {!isError ? (
              <FormHelperText>Add a task to the list.</FormHelperText>
            ) : (
              <FormErrorMessage>Task is required.</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="yellow" mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleAddTask}
            isDisabled={isError}
          >
            Add Task
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
