export interface Column {
  id: string;
  name: string;
  position: number;
  color: string;
}

export interface Task {
  id: string;
  text: string;
  columnId: string;
  position: number;
}

export interface User {
  id: string;
  username: string;
  currentChallenge?: string;
}

export interface Authenticator {
  credentialID: Uint8Array;
  credentialPublicKey: Uint8Array;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: AuthenticatorTransport[];
  userId: string;
}

export enum DefaultColumnId {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  IN_REVIEW = "inReview",
  DONE = "done",
}
