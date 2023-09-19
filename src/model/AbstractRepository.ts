import { mapping } from "cassandra-driver";

export abstract class AbstractRepository<T extends { [key: string]: any }, U> {
  public abstract get tableName(): string;
  public abstract get entityName(): string;
  public abstract get mapper(): mapping.ModelMapper<U>;

  protected abstract convertEntityToDTO(row: U): T;
  public abstract createTable(): Promise<unknown>;

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
    const result = await this.mapper.insert(input);
    const first = result.first();
    if (!first) {
      return null;
    }
    return this.convertEntityToDTO(first);
  }

  async update(id: string, input: Partial<T>): Promise<T | null> {
    const query = await this.mapper.update({ id }, input);
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
