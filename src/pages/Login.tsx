import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../firebase/firebase";
import {
  Box,
  Container,
  Center,
  HStack,
  Input,
  Text,
  Divider,
  Button,
  Image,
  Flex,
} from "@chakra-ui/react";
import GoogleButton from "../components/GoogleButton";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log(user);
    debugger;
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/");
  }, [user, loading]);

  return (
    <Container w={"100vw"} h={"100vh"}>
      <Center h={"100%"}>
        <Box>
          <Center>
            <Text fontSize="4xl">Welcome to Diagram!</Text>
          </Center>
          <Center>
            <Text fontSize="2xl">Please login before continue</Text>
          </Center>
          <Divider marginY={15} />
          <HStack>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail Address"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </HStack>
          <Center my={15}>
            <Button
              colorScheme="blue"
              size={"sm"}
              onClick={() => logInWithEmailAndPassword(email, password)}
            >
              Login
            </Button>
          </Center>
          <Center>
            <Box w={"50%"}>
              <GoogleButton text={"Login with Google"} />
            </Box>
          </Center>
          <Center>
            <div>
              <Link to="/reset">Forgot Password</Link>
            </div>
          </Center>
          <Center>
            <div>
              Don't have an account? <Link to="/register">Register</Link> now.
            </div>
          </Center>
        </Box>
      </Center>
    </Container>
  );
};

export default Login;
