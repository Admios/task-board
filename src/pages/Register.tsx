import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  signInWithGoogle,
  registerWithEmailAndPassword,
} from "../firebase/firebase";
import { Box, Button, Center, Container, Flex, Input } from "@chakra-ui/react";
import GoogleButton from "../components/GoogleButton";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/");
  }, [user, loading]);

  return (
    <Container w={"100vw"} h={"100vh"}>
      <Center h={"100%"}>
        <Flex flexDirection={"column"}>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            mt={15}
          />
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            mt={15}
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            mt={15}
          />
          <Button className="register__btn" onClick={handleRegister} mt={15}>
            Register
          </Button>
          <Box mt={15}>
            <GoogleButton text={"Register with Google"} />
          </Box>

          <Box mt={15}>
            Already have an account? <Link to="/">Login</Link> now.
          </Box>
        </Flex>
      </Center>
    </Container>
  );
};

export default Register;
