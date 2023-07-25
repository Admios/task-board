import * as React from "react";
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
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  React.useEffect(() => {
    console.log(user);
    debugger;
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) router.push("/");
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
