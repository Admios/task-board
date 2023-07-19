import "./Home.css";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/firebase";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Column from "../components/Column/Column";

interface ColumnData {
  title: string;
  tasks: string[];
  color: string;
  input: string;
}

const mockData: ColumnData[] = [
  {
    title: "Review",
    tasks: ["Task 87", "Task 29", "Task 63", "Task 4"],
    color: "green",
    input: "",
  },
  {
    title: "In Progress",
    tasks: ["Task 45", "Task 56"],
    color: "red",
    input: "",
  },
  {
    title: "Done",
    tasks: ["Task 7", "Task 98", "Task 9"],
    color: "blue",
    input: "",
  },
  {
    title: "New",
    tasks: ["Task 17", "Task 28", "Task 39"],
    color: "black",
    input: "",
  },
];

const getColumnSection = () => (
  <>
    {mockData.map((column, index) => (
      <Column
        key={index}
        itemList={column.tasks}
        colTitle={column.title}
        color={column.color}
      />
    ))}
  </>
);
const Home = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box>
      <Box as="header">
        <Button colorScheme="blue" onClick={handleLogout}>
          Logout
        </Button>
        <Heading mx="auto">Board</Heading>
      </Box>
      <Flex direction={"row"}>{getColumnSection()}</Flex>
    </Box>
  );
};

export default Home;
