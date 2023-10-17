import { mapper } from "./CassandraClient";

export abstract class BaseRepository<T extends Record<string, any>> {
  public abstract get tableName(): string;
  public abstract get entityName(): string;

  get mapper() {
    return mapper.forModel<T>(this.entityName);
  }

  async findById(id: string): Promise<T> {
    const result = await this.mapper.get({ id });
    if (!result) {
      throw new Error(`${this.entityName} not found`);
    }

    return result;
  }

  async list(): Promise<T[]> {
    const result = await this.mapper.findAll();
    return Array.isArray(result) ? result : result.toArray();
  }

  async create(input: T): Promise<T | null> {
    const result = await this.mapper.insert(input);
    const first = result.first();
    if (!first) {
      return null;
    }
    return first;
  }

  async update(input: T): Promise<T | null> {
    const query = await this.mapper.update(input);
    const first = query.first();
    if (!first) {
      return null;
    }
    return first;
  }

  async delete(id: string) {
    await this.mapper.remove({ id });
  }
}
