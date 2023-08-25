export interface AbstractRepository<T> {
  findById(id: string): Promise<T>;
  list(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): Promise<T>;
}
