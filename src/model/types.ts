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

export type CredentialDeviceType = "singleDevice" | "multiDevice";

export interface Authenticator {
  id: string;
  credentialID: Uint8Array;
  credentialPublicKey: Uint8Array;
  counter: number;
  credentialDeviceType: CredentialDeviceType;
  credentialBackedUp: boolean;
  transports?: AuthenticatorTransport[];
  userId: string;
}

export interface AbstractRepository<T> {
  findById(id: string): Promise<T>;
  list(): Promise<T[]>;
  create(input: T): Promise<T>;
  update(id: string, input: T): Promise<T>;
  delete(id: string): Promise<void>;
  truncate(): Promise<void>;
}

export enum DefaultColumnId {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  IN_REVIEW = "inReview",
  DONE = "done",
}
