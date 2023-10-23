import { BaseRepository } from "./BaseRepository";
import { mapper } from "./CassandraClient";

jest.mock("./CassandraClient");

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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("findById should return an entity by ID", async () => {
    const baseRepository: BaseRepository<TestEntity> = new TestRepository();
    const mapperMock = mapper.forModel("");
    const entity: TestEntity = { id: "1", name: "TestEntityName" };

    (mapperMock.get as jest.Mock).mockResolvedValue(entity);

    const result = await baseRepository.findById("1");

    expect(result).toEqual(entity);
    expect(mapperMock.get).toHaveBeenCalledWith({ id: "1" });
  });

  it("findById should throw an error if entity is not found", async () => {
    const baseRepository: BaseRepository<TestEntity> = new TestRepository();
    const mapperMock = mapper.forModel("");

    (mapperMock.get as jest.Mock).mockResolvedValue(null);

    await expect(baseRepository.findById("1")).rejects.toThrowError(
      "TestEntity not found",
    );
  });

  it("list should return a list of entities", async () => {
    const baseRepository: BaseRepository<TestEntity> = new TestRepository();
    const mapperMock = mapper.forModel("");
    const entities: TestEntity[] = [
      { id: "1", name: "TestEntityName1" },
      { id: "2", name: "TestEntityName2" },
    ];
    const response = {
      toArray: () => entities,
    };

    (mapperMock.findAll as jest.Mock).mockResolvedValue(response);

    const result = await baseRepository.list();

    expect(result).toEqual(entities);
    expect(mapperMock.findAll as jest.Mock).toHaveBeenCalled();
  });

  it("create should insert an entity and return the first result", async () => {
    const baseRepository: BaseRepository<TestEntity> = new TestRepository();
    const mapperMock = mapper.forModel("");
    const entity: TestEntity = { id: "1", name: "TestEntityName" };
    const insertResult = { first: () => entity };

    (mapperMock.insert as jest.Mock).mockResolvedValue(insertResult);

    const result = await baseRepository.create(entity);

    expect(result).toEqual(entity);
    expect(mapperMock.insert as jest.Mock).toHaveBeenCalledWith(entity);
  });

  it("create should return null if the entity is not created", async () => {
    const baseRepository: BaseRepository<TestEntity> = new TestRepository();
    const mapperMock = mapper.forModel("");
    const entity: TestEntity = { id: "1", name: "TestEntityName" };
    const insertResult = { first: () => null };
    (mapperMock.insert as jest.Mock).mockResolvedValue(insertResult);

    const result = await baseRepository.create(entity);

    expect(result).toEqual(null);
    expect(mapperMock.insert as jest.Mock).toHaveBeenCalledWith(entity);
  });

  it("update should update an entity and return the first result", async () => {
    const baseRepository: BaseRepository<TestEntity> = new TestRepository();
    const mapperMock = mapper.forModel("");
    const entity: TestEntity = { id: "1", name: "UpdatedEntity" };
    const updatedResult = { first: () => entity };
    (mapperMock.update as jest.Mock).mockResolvedValue(updatedResult);

    const result = await baseRepository.update(entity);

    expect(result).toEqual(entity);
    expect(mapperMock.update as jest.Mock).toHaveBeenCalledWith(entity);
  });

  it("update should return null if the entity is not updated", async () => {
    const baseRepository: BaseRepository<TestEntity> = new TestRepository();
    const mapperMock = mapper.forModel("");
    const entity: TestEntity = { id: "1", name: "UpdatedEntity" };
    const updatedResult = { first: () => null };
    (mapperMock.update as jest.Mock).mockResolvedValue(updatedResult);

    const result = await baseRepository.update(entity);

    expect(result).toEqual(null);
    expect(mapperMock.update as jest.Mock).toHaveBeenCalledWith(entity);
  });

  it("delete should remove an entity by ID", async () => {
    const baseRepository: BaseRepository<TestEntity> = new TestRepository();
    const mapperMock = mapper.forModel("");
    await baseRepository.delete("1");
    expect(mapperMock.remove as jest.Mock).toHaveBeenCalledWith({ id: "1" });
  });
});
