import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/firebase";
import { Box, Button, Flex } from "@chakra-ui/react";

const Home = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box w={"100vw"} h={"100vh"}>
      <Flex flexDirection={"column"}>
        <Box>
          <Button onClick={handleLogout}>Logout</Button>
        </Box>
        <Box>
          Hello World
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
