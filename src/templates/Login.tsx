import GoogleButton from "@/components/GoogleButton";
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function doLogin() {}

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
            <Button colorScheme="blue" size={"sm"} onClick={doLogin}>
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
              <Link href="/reset">Forgot Password</Link>
            </div>
          </Center>
          <Center>
            <div>
              Don &apos t have an account?{" "}
              <Link href="/register">Register</Link> now.{" "}
            </div>
          </Center>
        </Box>
      </Center>
    </Container>
  );
};

export default Login;