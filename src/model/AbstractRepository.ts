export interface AbstractRepository<T> {
  findById(id: string): Promise<T>;
  list(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string, entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
