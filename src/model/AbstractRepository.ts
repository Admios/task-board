type CassandraEntity = any;

export abstract class AbstractRepository<T> {
  protected abstract getEntity(): CassandraEntity;
  protected abstract getEntityName(): string;
  protected abstract convertEntityToModel(entity: CassandraEntity): T;
  protected abstract convertModelToEntity(model: T): CassandraEntity;

  public abstract seed(): Promise<unknown>;

  findById(id: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.getEntity().find({ id, $limit: 1 }, (err: unknown, result: T[]) => {
        if (err || !result) {
          reject(err);
        }

        if (result.length < 1) {
          reject(new Error(`${this.getEntityName()} not found`));
        }

        resolve(this.convertEntityToModel(result[0]));
      });
    });
  }

  list(): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.getEntity().find({}, (err: unknown, result: T[]) => {
        if (err || !result) {
          reject(err);
        }

        if (Array.isArray(result)) {
          resolve(result.map((entity) => this.convertEntityToModel(entity)));
        } else {
          resolve(result);
        }
      });
    });
  }

  create(input: T): Promise<T> {
    const Model = this.getEntity();
    const inputEntity = this.convertModelToEntity(input);

    return new Promise<T>((resolve, reject) => {
      const newItem = new Model(inputEntity);

      newItem.save((err: unknown, result: T) => {
        if (err || !result) {
          reject(err);
        }

        resolve(this.convertEntityToModel(result));
      });
    });
  }

  update(id: string, input: T): Promise<T> {
    const Model = this.getEntity();
    return new Promise<T>((resolve, reject) => {
      const entity = this.convertModelToEntity(input);
      Model.update({ id }, { entity }, (err: unknown, result: T) => {
        if (err || !result) {
          reject(err);
        }

        resolve(this.convertEntityToModel(result));
      });
    });
  }

  delete(id: string): Promise<void> {
    const Model = this.getEntity();
    return new Promise<void>((resolve, reject) => {
      Model.delete({ id }, (err: unknown) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }

  truncate(): Promise<void> {
    const Model = this.getEntity();
    return new Promise<void>((resolve, reject) => {
      Model.truncate({}, (err: unknown) => {
        if (err) {
          reject(err);
        }

        resolve();
      });
    });
  }
}
