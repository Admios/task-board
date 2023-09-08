async function handleAsync<T>(operation: () => Promise<T>): Promise<T> {
  try {
      return await operation();
  } catch (error) {
      console.error("Error during operation:", error);
      throw error;
  }
}

export abstract class BaseRepository<T> {
  model: any;

  constructor(model: any) {
      this.model = model;
  }

  async create(entity: T): Promise<boolean> {
      return handleAsync(async () => {
          const instance = new this.model(entity);
          await instance.saveAsync();
          return true;
      });
  }

  async findAll(): Promise<T[]> {
      return handleAsync(() => this.model.findAsync({}));
  }
}
