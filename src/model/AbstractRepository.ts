import { mapper } from "./CassandraClient";

export abstract class AbstractRepository<T extends Record<string, any>> {
  public abstract get tableName(): string;
  public abstract get entityName(): string;

  public abstract createTable(): Promise<unknown>;

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
    return result.toArray();
  }

  async create(input: T): Promise<T | null> {
    const result = await this.mapper.insert(input);
    const first = result.first();
    if (!first) {
      return null;
    }
    return first;
  }

  async update(id: string, input: Partial<Omit<T, "id">>): Promise<T | null> {
    const query = await this.mapper.update({ id }, input);
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
