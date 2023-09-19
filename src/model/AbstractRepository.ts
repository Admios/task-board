import { AbstractEntity } from "./AbstractEntity";
import { mapper } from "./CassandraClient";

export abstract class AbstractRepository<T, U extends AbstractEntity> {
  public abstract get tableName(): string;
  public abstract get entityName(): string;

  public abstract convertEntityToDTO(row: U): T;
  public abstract convertDTOToEntity(input: T): U;
  public abstract createTable(): Promise<unknown>;

  get mapper() {
    return mapper.forModel<U>(this.entityName);
  }

  async findById(id: string): Promise<T> {
    const result = await this.mapper.get({ id });
    if (!result) {
      throw new Error(`${this.entityName} not found`);
    }

    return this.convertEntityToDTO(result);
  }

  async list(): Promise<T[]> {
    const result = await this.mapper.findAll();
    return result.toArray().map((row) => this.convertEntityToDTO(row));
  }

  async create(input: T): Promise<T | null> {
    const entity = this.convertDTOToEntity(input);
    const result = await this.mapper.insert(entity);
    const first = result.first();
    if (!first) {
      return null;
    }
    return this.convertEntityToDTO(first);
  }

  async update(id: string, input: Partial<T>): Promise<T | null> {
    const entity: Partial<U> = this.convertDTOToEntity(input as T);
    const query = await this.mapper.update({ id }, entity);
    const first = query.first();
    if (!first) {
      return null;
    }
    return this.convertEntityToDTO(first);
  }

  async delete(id: string) {
    await this.mapper.remove({ id });
  }
}
