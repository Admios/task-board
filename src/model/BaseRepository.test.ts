/**
 * @jest-environment node
 */

import { BaseRepository } from "./BaseRepository";
import { defineColumns } from "./columns";
import { db } from "./SqliteClient";

interface TestEntity {
  id: string;
  name: string;
}

class TestRepository extends BaseRepository<TestEntity> {
  constructor() {
    super({
      tableName: "test_table",
      entityName: "TestEntity",
      columns: defineColumns<TestEntity>({ id: true, name: true }),
    });
  }
}

describe("BaseRepository", () => {
  beforeAll(() => {
    db.exec(`CREATE TABLE "test_table" ("id" TEXT PRIMARY KEY, "name" TEXT)`);
  });

  beforeEach(() => {
    db.exec(`DELETE FROM "test_table"`);
  });

  it("findById should return an entity by ID", () => {
    const repository = new TestRepository();
    const entity: TestEntity = { id: "1", name: "TestEntityName" };

    repository.create(entity);
    const result = repository.findById("1");

    expect(result).toEqual(entity);
  });

  it("findById should return a plain object, not a null-prototype one", () => {
    // node:sqlite returns rows as `[Object: null prototype]`. React rejects
    // those as props to a Client Component ("Only plain objects ... can be
    // passed"), so fromRow's default implementation must copy the row
    // rather than cast it directly. toEqual() alone wouldn't catch a
    // regression here — it ignores prototypes.
    const repository = new TestRepository();
    repository.create({ id: "1", name: "TestEntityName" });

    const result = repository.findById("1");

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  it("findById should throw an error if entity is not found", () => {
    const repository = new TestRepository();

    expect(() => repository.findById("1")).toThrow("TestEntity not found");
  });

  it("list should return a list of entities", () => {
    const repository = new TestRepository();
    const entities: TestEntity[] = [
      { id: "1", name: "TestEntityName1" },
      { id: "2", name: "TestEntityName2" },
    ];

    for (const entity of entities) {
      repository.create(entity);
    }

    const result = repository.list();

    expect(result).toEqual(expect.arrayContaining(entities));
    expect(result).toHaveLength(entities.length);
  });

  it("create should insert an entity and return it", () => {
    const repository = new TestRepository();
    const entity: TestEntity = { id: "1", name: "TestEntityName" };

    const result = repository.create(entity);

    expect(result).toEqual(entity);
    expect(repository.findById("1")).toEqual(entity);
  });

  it("create should throw if an entity with the same id already exists", () => {
    const repository = new TestRepository();
    repository.create({ id: "1", name: "Original" });

    expect(() => repository.create({ id: "1", name: "Duplicate" })).toThrow();
    // The original row must be untouched by the failed insert.
    expect(repository.findById("1")).toEqual({ id: "1", name: "Original" });
  });

  it("update should update an existing entity", () => {
    const repository = new TestRepository();
    repository.create({ id: "1", name: "OriginalName" });

    const updated: TestEntity = { id: "1", name: "UpdatedEntity" };
    const result = repository.update(updated);

    expect(result).toEqual(updated);
    expect(repository.findById("1")).toEqual(updated);
  });

  it("update should throw if no row matches the id, rather than inserting one", () => {
    const repository = new TestRepository();
    const entity: TestEntity = { id: "42", name: "NoSuchRow" };

    expect(() => repository.update(entity)).toThrow("TestEntity not found");
    expect(() => repository.findById("42")).toThrow("TestEntity not found");
  });

  it("upsert should insert when the row doesn't exist", () => {
    const repository = new TestRepository();
    const entity: TestEntity = { id: "1", name: "TestEntityName" };

    const result = repository.upsert(entity);

    expect(result).toEqual(entity);
    expect(repository.findById("1")).toEqual(entity);
  });

  it("upsert should overwrite when the row already exists", () => {
    const repository = new TestRepository();
    repository.create({ id: "1", name: "Original" });

    const updated: TestEntity = { id: "1", name: "Overwritten" };
    repository.upsert(updated);

    expect(repository.findById("1")).toEqual(updated);
  });

  it("delete should remove an entity by ID", () => {
    const repository = new TestRepository();
    repository.create({ id: "1", name: "TestEntityName" });

    repository.delete("1");

    expect(() => repository.findById("1")).toThrow("TestEntity not found");
  });

  it("delete on a non-existent id is a no-op, not an error", () => {
    const repository = new TestRepository();

    expect(() => repository.delete("does-not-exist")).not.toThrow();
  });
});
