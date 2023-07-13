import React from "react";
import { Box, Center, Flex, Image, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { signInWithGoogle } from "../firebase/firebase";

const GoogleButton = ({ text }: { text: string }) => {
  return (
    <Box
      as="button"
      onClick={signInWithGoogle}
      _hover={{
        boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)",
      }}
      w={"100%"}
    >
      <Flex
        direction={"row"}
        border={1}
        borderColor={"blue.400"}
        borderStyle={"solid"}
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          w={8}
          h={8}
          borderRight={1}
          borderStyle={"solid"}
          borderColor={"blue.400"}
          padding={2}
        />
        <Center w={"100%"} mx={5}>
          <Text>{text}</Text>
        </Center>
      </Flex>
    </Box>
  );
};

GoogleButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default GoogleButton;
