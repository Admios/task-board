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
import { ColumnDTO } from "@/model/Column";
import { v4 as uuid } from "uuid";
import { addColumnToDB } from "./serverActions";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddColumnModal({ isOpen, onClose }: AddModalProps) {
  const addColumn = useZustand((store) => store.addColumn);
  const columns = useZustand((store) => store.columns);
  const [title, setTitle] = useState("");
  const isError = title === "";

  const submit = async () => {
    const newColumn: ColumnDTO = {
      id: uuid(),
      name: title,
      color: "black",
      position: columns.length + 1,
    };
    await addColumnToDB(newColumn);
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
