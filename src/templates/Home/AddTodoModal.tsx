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
import { useZustand } from "./state";
import { v4 as uuid } from "uuid";
import { addTodoDB } from "./serverActions";

interface AddModalProps {
  columnId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddTodoModal({ isOpen, onClose, columnId }: AddModalProps) {
  const user = useZustand((store) => store.user);
  const todoList = useZustand((store) => columnId ? store.todos[columnId] : undefined);
  const addTodo = useZustand((store) => store.addTodo);
  const [title, setTitle] = useState("");
  const isError = title === "";

  const handleAddTask = () => {
    if (!user || !columnId) return;
    const newTodo = { text: title, columnId, id: uuid(), position: todoList ? todoList.length : 0, owner: user.username };
    addTodoDB(newTodo)
    addTodo(newTodo);
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
