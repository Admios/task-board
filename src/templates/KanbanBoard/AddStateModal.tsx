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
import { v4 as uuid } from "uuid";
import { addStateDB } from "./kanbanActions";
import { useZustand } from "./model";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStateModal({ isOpen, onClose }: AddModalProps) {
  const states = useZustand((store) => store.states);
  const addState = useZustand((store) => store.addState);
  const user = useZustand((store) => store.user);
  const [title, setTitle] = useState("");
  const isError = title === "";

  const submit = () => {
    if (!user) {
      return;
    }
    const newState = {
      name: title,
      id: uuid(),
      color: "black",
      position: Object.values(states).length,
      owner: user.email,
    };
    addStateDB(newState);
    addState(newState);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTitle("");
  };

  const submitOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && !isError) {
      submit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add State</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={isError}>
            <FormLabel>Name:</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
              onKeyUp={submitOnEnter}
            />

            {!isError ? (
              <FormHelperText>The name of the new state.</FormHelperText>
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
            onClick={submit}
            isDisabled={isError}
          >
            Add State
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
