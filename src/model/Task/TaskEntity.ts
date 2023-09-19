import { AbstractEntity } from "@/model/AbstractEntity";

export interface TaskEntity extends AbstractEntity {
  id: string;
  text: string;
  columnId: string;
  position: number;
}
