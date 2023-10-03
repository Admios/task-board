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
import { addColumnDB } from "./homeServerActions";
import { v4 as uuid } from "uuid";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddColumnModal({ isOpen, onClose }: AddModalProps) {
  const columns = useZustand((store) => store.columns);
  const addColumn = useZustand((store) => store.addColumn);
  const user = useZustand((store) => store.user);
  const [title, setTitle] = useState("");
  const isError = title === "";

  const submit = () => {
    if (!user) { return }
    const newColumn = { name: title, id: uuid(), color: "black", position: Object.values(columns).length, owner: user.username }
    addColumnDB(newColumn);
    addColumn(newColumn);
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
  }

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
              autoFocus
              onKeyUp={submitOnEnter}
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
            onClick={submit}
            isDisabled={isError}
          >
            Add Column
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
