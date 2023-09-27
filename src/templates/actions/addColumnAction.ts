'use server';

import { ColumnDTO, ColumnRepository } from "@/model/Column";

export async function addColumnAction(newColumn: ColumnDTO) {
    const columnRepository = new ColumnRepository();
    columnRepository.create(newColumn);
  }