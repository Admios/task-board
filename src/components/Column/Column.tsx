import React, { useState } from "react";
import Modal from "../Modal/Modal";
import Item from "../Item/Item";
import "../../App.css";
import {
  Box,
  Button,
  Center,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
interface ColumnProps {
  itemList: string[];
  colTitle: string;
  color: string;
}

const Column: React.FC<ColumnProps> = ({ itemList, colTitle, color }) => {
  const [showModal, setShowModal] = useState(false);

  const openAddNewTaskModal = () => {
    setShowModal(true);
  };

  const addItem = (task: string) => {
    itemList.push(task);
    setShowModal(false);
  };

  return (
    <>
      <Box>
        {showModal && (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            columnTitle={colTitle}
            addItem={addItem}
          />
        )}
      </Box>
      <Card bg={"gray.300"} mx={2} minW={350}>
        <CardHeader>
          <Center color={"gray.900"}>
            <Heading size={"md"}>{colTitle}</Heading>
          </Center>
        </CardHeader>
        <CardBody>
          {itemList.map((item, index) => (
            <Item key={index} data={item} color={color} />
          ))}
        </CardBody>
        <CardFooter>
          <Center>
            <Button onClick={openAddNewTaskModal} bgColor={"blue.500"}>
              Add task
            </Button>
          </Center>
        </CardFooter>
      </Card>
    </>
  );
};

export default Column;
