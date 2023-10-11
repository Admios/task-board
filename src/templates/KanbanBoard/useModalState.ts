import { Reducer, useReducer } from "react";
import { Task } from "./model";

// State
interface ModalState {
  addStateIsOpen: boolean;
  editingStateId?: string;
  editingTask?: Task;
}

const initialState: ModalState = {
  addStateIsOpen: false,
};

// Actions
interface OpenStateModal {
  key: "ADD_STATE::OPEN";
}

interface CloseSetDialog {
  key: "ADD_STATE::CLOSE";
}

interface OpenEditTaskDialog {
  key: "EDIT_TASK::OPEN";
  payload: { task: Task };
}

interface CloseEditTaskDialog {
  key: "EDIT_TASK::CLOSE";
}

interface OpenAddTaskDialog {
  key: "ADD_TASK::OPEN";
  payload: { stateId: string };
}

interface CloseAddTaskDialog {
  key: "ADD_TASK::CLOSE";
}

type ModalAction =
  | OpenStateModal
  | CloseSetDialog
  | OpenEditTaskDialog
  | CloseEditTaskDialog
  | OpenAddTaskDialog
  | CloseAddTaskDialog;

// Reducer
const modalReducer: Reducer<ModalState, ModalAction> = (_, action) => {
  switch (action.key) {
    case "ADD_STATE::OPEN":
      return { ...initialState, addStateIsOpen: true };
    case "ADD_STATE::CLOSE":
      return { ...initialState, addStateIsOpen: false };
    case "EDIT_TASK::OPEN":
      return { ...initialState, editingTask: action.payload.task };
    case "EDIT_TASK::CLOSE":
      return { ...initialState, editingTask: undefined };
    case "ADD_TASK::OPEN":
      return { ...initialState, editingStateId: action.payload.stateId };
    case "ADD_TASK::CLOSE":
      return { ...initialState, editingStateId: undefined };
  }
};

export function useModalState() {
  return useReducer(modalReducer, initialState);
}
