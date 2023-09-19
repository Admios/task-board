import { AbstractEntity } from "@/model/AbstractEntity";

export interface UserEntity extends AbstractEntity {
  id: string;
  username: string;
  currentChallenge?: string;
}
