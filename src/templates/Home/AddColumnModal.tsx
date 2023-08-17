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
import { v4 } from "uuid";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddColumnModal({ isOpen, onClose }: AddModalProps) {
  const addColumn = useZustand((store) => store.addColumn);
  const [title, setTitle] = useState("");
  const isError = title === "";

  const handleAddTask = () => {
    addColumn(v4(), title);
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
        <ModalHeader>Add Column</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={isError}>
            <FormLabel>Name:</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            {!isError ? (
              <FormHelperText>The name of the new column.</FormHelperText>
            ) : (
              <FormErrorMessage>Name is required.</FormErrorMessage>
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
            Add Column
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
