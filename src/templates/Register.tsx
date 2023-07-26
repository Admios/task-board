import GoogleButton from "@/components/GoogleButton";
import { Box, Button, Center, Container, Flex, Input } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = () => {
    if (!name) alert("Please enter name");
  };

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
            Already have an account? <Link href="/">Login</Link> now.
          </Box>
        </Flex>
      </Center>
    </Container>
  );
};

export default Register;
