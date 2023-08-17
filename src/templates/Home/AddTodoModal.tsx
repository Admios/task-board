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
import { useState } from "react";
import { useZustand } from "./state";

interface AddModalProps {
  columnId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddTodoModal({ isOpen, onClose, columnId }: AddModalProps) {
  const addTodo = useZustand((store) => store.addTodo);
  const [title, setTitle] = useState("");
  const isError = title === "";

  const handleAddTask = () => {
    if (columnId === undefined) return;

    addTodo(title, columnId);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTitle("");
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
