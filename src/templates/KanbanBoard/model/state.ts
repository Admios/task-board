import { StateDTO } from "@/model/State";
import { TaskDTO } from "@/model/Task";
import { UserDTO } from "@/model/User";
import { Immutable } from "immer";
import { State, Task } from "./types";

export type KanbanState = Immutable<{
  /**
   * The order of the states in the board.
   */
  statesOrder: string[];

  /**
   * The order of the tasks in each state.
   */
  tasksOrder: Record<string, string[]>;

  /**
   * Key: taskId. Value: Task.
   */
  tasks: Record<string, Task>;

  /**
   * Key: stateId. Value: State.
   */
  states: Record<string, State>;

  /**
   * The user that is currently logged in
   */
  user?: UserDTO;
}>;

export interface KanbanActions {
  setUser(user?: UserDTO): void;
  initialize(initialTasks: TaskDTO[], initialStates: StateDTO[]): void;
  addTask(newTask: Task): Task;
  moveTask(
    newTask: Task,
    fromStateId: string,
    toStateId: string,
    position: number,
  ): void;
  addState(newState: State): State;
  editTask(id: string, updatedValues: Partial<Task>): void;
  deleteTask: (id: string) => void;

  clear(): void;
}
