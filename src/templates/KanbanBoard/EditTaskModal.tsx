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
import { Task, useZustand } from "./model";
import { editTaskDB } from "./kanbanActions";

interface AddModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTaskModal({ isOpen, onClose, task }: AddModalProps) {
  const editTask = useZustand((store) => store.editTask);
  const [text, setText] = useState("");
  const isError = text === "";

  const handleEditTask = () => {
    if (!task) return;
    const taskUpdate = { ...task, text };
    editTaskDB(taskUpdate);
    editTask(taskUpdate.id, { ...taskUpdate, text });
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setText("");
  };

  const submitOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && !isError) {
      handleEditTask();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={isError}>
            <FormLabel>Task:</FormLabel>
            <Input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyUp={submitOnEnter}
              autoFocus
            />

            {!isError ? (
              <FormHelperText>Edit this task.</FormHelperText>
            ) : (
              <FormErrorMessage>Text is required.</FormErrorMessage>
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
            onClick={handleEditTask}
            isDisabled={isError}
          >
            Edit Task
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
