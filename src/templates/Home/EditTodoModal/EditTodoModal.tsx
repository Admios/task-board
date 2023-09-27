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
import { Todo, useZustand } from "../state";
import { editTodoAction } from "../serverActions";

interface AddModalProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTodoModal({ isOpen, onClose, todo }: AddModalProps) {
  const editTodo = useZustand((store) => store.editTodo);
  const [text, setText] = useState("");
  const isError = text === "";

  const handleEditTask = () => {
    editTodoAction({...todo, text})
    editTodo({...todo, text});
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
            <FormLabel>Todo:</FormLabel>
            <Input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyUp={submitOnEnter}
              autoFocus
            />

            {!isError ? (
              <FormHelperText>Edit this todo.</FormHelperText>
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
            Edit Todo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
