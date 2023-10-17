import { BaseRepository } from "./BaseRepository";

const mapper = {
  get: jest.fn(),
  findAll: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

jest.mock("./CassandraClient", () => ({
  mapper: {
    forModel: jest.fn(() => mapper),
  },
}));

interface TestEntity {
  id: string;
  name: string;
}

export default class TestRepository extends BaseRepository<TestEntity> {
  public get tableName(): string {
    return "test_table";
  }

  public get entityName(): string {
    return "TestEntity";
  }
}

describe("BaseRepository", () => {
  let baseRepository: BaseRepository<TestEntity>;

  beforeEach(() => {
    baseRepository = new TestRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("findById should return an entity by ID", async () => {
    const entity: TestEntity = { id: "1", name: "TestEntityName" };
    mapper.get.mockResolvedValue(entity);

    const result = await baseRepository.findById("1");

    expect(result).toEqual(entity);
    expect(mapper.get).toHaveBeenCalledWith({ id: "1" });
  });

  it("findById should throw an error if entity is not found", async () => {
    mapper.get.mockResolvedValue(null);

    await expect(baseRepository.findById("1")).rejects.toThrowError(
      "TestEntity not found",
    );
  });

  it("list should return a list of entities", async () => {
    const entities: TestEntity[] = [
      { id: "1", name: "TestEntityName1" },
      { id: "2", name: "TestEntityName2" },
    ];
    mapper.findAll.mockResolvedValue(entities);

    const result = await baseRepository.list();

    expect(result).toEqual(entities);
    expect(mapper.findAll).toHaveBeenCalled();
  });

  it("create should insert an entity and return the first result", async () => {
    const entity: TestEntity = { id: "1", name: "TestEntityName" };
    const insertResult = { first: () => entity };
    mapper.insert.mockResolvedValue(insertResult);

    const result = await baseRepository.create(entity);

    expect(result).toEqual(entity);
    expect(mapper.insert).toHaveBeenCalledWith(entity);
  });

  it("create should return null if the entity is not created", async () => {
    const entity: TestEntity = { id: "1", name: "TestEntityName" };
    const insertResult = { first: () => null };
    mapper.insert.mockResolvedValue(insertResult);

    const result = await baseRepository.create(entity);

    expect(result).toEqual(null);
    expect(mapper.insert).toHaveBeenCalledWith(entity);
  });

  it("update should update an entity and return the first result", async () => {
    const entity: TestEntity = { id: "1", name: "UpdatedEntity" };
    const updatedResult = { first: () => entity };
    mapper.update.mockResolvedValue(updatedResult);

    const result = await baseRepository.update(entity);

    expect(result).toEqual(entity);
    expect(mapper.update).toHaveBeenCalledWith(entity);
  });

  it("update should return null if the entity is not updated", async () => {
    const entity: TestEntity = { id: "1", name: "UpdatedEntity" };
    const updatedResult = { first: () => null };
    mapper.update.mockResolvedValue(updatedResult);

    const result = await baseRepository.update(entity);

    expect(result).toEqual(null);
    expect(mapper.update).toHaveBeenCalledWith(entity);
  });

  it("delete should remove an entity by ID", async () => {
    await baseRepository.delete("1");
    expect(mapper.remove).toHaveBeenCalledWith({ id: "1" });
  });
});
