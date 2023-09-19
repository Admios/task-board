import { AbstractEntity } from "@/model/AbstractEntity";

export interface ColumnEntity extends AbstractEntity {
  id: string;
  name: string;
  position: number;
  color: string;
}
