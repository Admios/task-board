import * as React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/firebase";
import { Box, Button } from "@chakra-ui/react";
const Login = () => {
  let navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <Box>
      <Box>Home</Box>
      <Box>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Box>
  );
};

export default Login;
