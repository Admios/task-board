export interface Task {
  id: string;
  stateId: string;
  text: string;
  position: number;
}

export interface State {
  id: string;
  boardId: string;
  name: string;
  position: number;
  color: string;
}

export interface Board {
  id: string;
  name: string;
  owner: string;
}
