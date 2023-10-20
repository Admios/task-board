import { AddIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { clearCookies } from "./clearCookies";
import { addStateDB, addTaskDB } from "./kanbanActions";
import { State, Task, useZustand } from "./model";

interface NavLinkProps {
  children: React.ReactNode;
}

interface HeaderProps {
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
    href="/"
  >
    {children}
  </Box>
);

const Links = ["Board"];

async function createRandomTasks(count: number) {
  const { statesOrder, tasksOrder, user, addState, addTask } =
    useZustand.getState();
  if (!user) {
    return;
  }

  let startingPosition: number;
  let startingStateId: string;
  if (!statesOrder.length) {
    const item: State = {
      id: uuid(),
      name: "Blank State",
      color: "black",
      position: 0,
      owner: user.email,
    };
    await addStateDB(item);
    addState(item);
    startingPosition = 0;
    startingStateId = item.id;
  } else {
    startingStateId = statesOrder[0];
    startingPosition = tasksOrder[startingStateId].length;
  }

  const newTasks: Task[] = [];
  for (let index = 0; index < count; index++) {
    const text = `Random Task ${Math.floor(Math.random() * 100)}`;
    newTasks.push({
      text,
      stateId: startingStateId,
      id: uuid(),
      position: startingPosition + index,
      owner: user.email,
    });
  }

  const promises = newTasks.map(async (task) => {
    await addTaskDB(task);
    addTask(task);
    return task;
  });
  return Promise.all(promises);
}

export function Header({ onOpenStateDialog }: HeaderProps) {
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
        <Flex h={"8vh"} alignItems="center" justifyContent="space-between">
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
                <MenuItem
                  data-testid="add-state-button"
                  onClick={onOpenStateDialog}
                >
                  Add State
                </MenuItem>
                <MenuItem
                  data-testid="create-random-task-button"
                  onClick={() => createRandomTasks(10)}
                >
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
                  name={user ? user.email : "guest"}
                  src={user ? "" : "avatar.svg"}
                />
              </MenuButton>
              <MenuList alignItems="center">
                <br />
                <Center>
                  <Avatar
                    size="2xl"
                    bg="blue.500"
                    name={user ? user.email : "guest"}
                    src={user ? "" : "avatar.svg"}
                  />
                </Center>
                <br />
                <Center>
                  <p>{user?.email ? user.email : "guest"} </p>
                </Center>
                <br />
                <MenuDivider />
                {user ? (
                  <MenuItem data-testid="logout-button" onClick={handleLogout}>
                    Logout
                  </MenuItem>
                ) : (
                  <MenuItem data-testid="login-button" onClick={handleLogin}>
                    Login / Register
                  </MenuItem>
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
