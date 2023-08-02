import { Column, Todo } from "./types";
import { v4 as uuid } from "uuid";

export const columnNew: Column = {
  name: "New",
  position: 0,
  color: "black",
  id: "columnNew",
};

export const columnNewTodos: Todo[] = [
  {
    id: uuid(),
    text: "Task 17",
  },
  {
    id: uuid(),
    text: "Task 28",
  },
  {
    id: uuid(),
    text: "Task 39",
  },
];

export const columnInProgress: Column = {
  name: "In Progress",
  position: 1,
  color: "red",
  id: "columnInProgress",
};

export const columnInProgressTodos: Todo[] = [
  {
    id: uuid(),
    text: "Task 45",
  },
  {
    id: uuid(),
    text: "Task 56",
  },
];

export const columnInReview: Column = {
  name: "Review",
  position: 2,
  color: "green",
  id: "columnReview",
};

export const columnInReviewTodos: Todo[] = [
  {
    id: uuid(),
    text: "Task 87",
  },
  {
    id: uuid(),
    text: "Task 29",
  },
  {
    id: uuid(),
    text: "Task 63",
  },
  {
    id: uuid(),
    text: "Task 4",
  },
];

export const columnDone: Column = {
  name: "Done",
  position: 3,
  color: "blue",
  id: "columnDone",
};

export const columnDoneTodos: Todo[] = [
  {
    id: uuid(),
    text: "Task 7",
  },
  {
    id: uuid(),
    text: "Task 8",
  },
  {
    id: uuid(),
    text: "Task 9",
  },
];
