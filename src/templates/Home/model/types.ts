export interface Todo {
  id: string;
  stateId: string;
  text: string;
  position: number;
  owner: string;
}

export interface State {
  id: string;
  name: string;
  position: number;
  color: string;
  owner: string;
}
