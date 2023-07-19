import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import React, { FormEvent, FormEventHandler, useState } from "react";
import { useTodoList } from "../../context/TodoListContext";

interface ModalProps {
  columnTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const AddTodoModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  columnTitle,
}) => {
  const todoList = useTodoList();
  const { addTodo } = todoList;
  const [task, setTask] = useState("");
  const isError = task === "";

  const handleAddTask = () => {
    addTodo(task, columnTitle);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTask("");
  };
  const handleTaskChange = (e: FormEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement; // Specify the correct type
    setTask(inputElement.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{columnTitle} - Add task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={isError}>
            <FormLabel>Task:</FormLabel>
            <Input
              type="text"
              value={task}
              onInput={(event: FormEvent<HTMLInputElement>) =>
                handleTaskChange(event)
              }
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
  //   return (
  //     <>
  //       <div className="modal">
  //         <div className="modalWrapper">
  //           <h3>Add task</h3>
  //           <input
  //             value={task}
  //             onChange={(e) => setTask(e.target.value)}
  //           />
  //           <div className="actionButtons">
  //             <button  onClick={() => setShowModal(false)}>
  //               Cancel
  //             </button>
  //             <button onClick={() => addItem(task)}>
  //               Save
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // };
};
export default AddTodoModal;
