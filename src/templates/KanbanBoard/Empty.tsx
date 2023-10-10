import { StateDTO } from "@/model/State";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { v4 } from "uuid";
import { addStateDB } from "./kanbanActions";
import { useZustand } from "./model";

interface EmptyProps {
  isStateDialogOpen: boolean;
  onOpenStateDialog(): void;
}

export function Empty({ isStateDialogOpen, onOpenStateDialog }: EmptyProps) {
  return (
    <Center width="100%" height="100vh">
      <Card margin="16">
        <CardHeader>
          <Heading size="md">Your workspace is empty!</Heading>
        </CardHeader>

        <CardBody>
          <Text>
            You have no content yet. Create your first column with the button
            below!
          </Text>
        </CardBody>

        <CardFooter display="flex" gap="8">
          <Button
            colorScheme="blue"
            onClick={onOpenStateDialog}
            disabled={isStateDialogOpen}
          >
            Create Column
          </Button>
        </CardFooter>
      </Card>
    </Center>
  );
}
