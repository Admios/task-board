import { Box, Button, Tag } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { clearCookies } from "./clearCookies";
import { useZustand } from "./model";

function UserButton() {
  const user = useZustand((store) => store.user);
  const router = useRouter();

  function handleLogin() {
    router.push("/login");
  }

  async function handleLogout() {
    await clearCookies();
    router.push("/login");
  }

  if (!user) {
    return (
      <Button colorScheme="blue" onClick={handleLogin}>
        Login / Register
      </Button>
    );
  }

  return (
    <>
      <Tag colorScheme="blue">Your Username is: {user.username}</Tag>
      <Button colorScheme="blue" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
}

interface HeaderProps {
  handleCreateRandomTasks: () => void;
  onOpenStateDialog: () => void;
}

export function Header({
  handleCreateRandomTasks,
  onOpenStateDialog,
}: HeaderProps) {
  return (
    <Box as="header" display="flex" gap="4">
      <UserButton />
      <Button colorScheme="blue" onClick={onOpenStateDialog}>
        Add State
      </Button>
      <Button colorScheme="blue" onClick={handleCreateRandomTasks}>
        Create 10 random tasks
      </Button>
    </Box>
  );
}
