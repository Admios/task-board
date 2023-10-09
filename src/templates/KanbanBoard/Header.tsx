import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Center,
  Image,
} from "@chakra-ui/react";

import { clearCookies } from "./clearCookies";
import { useZustand } from "./model";

interface NavLinkProps {
  children: React.ReactNode;
}

interface HeaderProps {
  handleCreateRandomTasks?: () => void;
  onOpenStateDialog?: () => void;
}

const NavLink = ({ children }: NavLinkProps) => (
  <Box
    as="a"
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href="#"
  >
    {children}
  </Box>
);

const Links = ["Dashboard"];

export function Header({
  handleCreateRandomTasks,
  onOpenStateDialog,
}: HeaderProps) {
  const user = useZustand((store) => store.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  function handleLogin() {
    router.push("/login");
  }

  async function handleLogout() {
    await clearCookies();
  }

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Box>
              <Image src="admios-logo.svg" alt="" />
            </Box>
            <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <Menu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuButton
                as={Button}
                variant="solid"
                colorScheme="teal"
                size="sm"
                mr={4}
                leftIcon={<AddIcon />}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                Action
              </MenuButton>
              <MenuList>
                <MenuItem data-testid="add-state-button" onClick={onOpenStateDialog}>Add State</MenuItem>
                <MenuItem data-testid="create-random-task-button" onClick={handleCreateRandomTasks}>
                  Create 10 random tasks
                </MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
                data-testid="user-menu-button"
              >
                <Avatar
                  size="sm"
                  bg="blue.500"
                  name={user ? user.username : "guest"}
                  src={user ? "" : "avatar.svg"}
                />
              </MenuButton>
              <MenuList alignItems="center">
                <br />
                <Center>
                  <Avatar
                    size="2xl"
                    bg="blue.500"
                    name={user ? user.username : "guest"}
                    src={user ? "" : "avatar.svg"}
                  />
                </Center>
                <br />
                <Center>
                  <p>{user?.username ? user.username : "guest"} </p>
                </Center>
                <br />
                <MenuDivider />
                {user ? (
                  <MenuItem data-testid="logout-button" onClick={handleLogout}>Logout</MenuItem>
                ) : (
                  <MenuItem data-testid="login-button" onClick={handleLogin}>Login / Register</MenuItem>
                )}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
