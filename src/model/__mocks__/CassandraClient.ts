import { mapping } from "cassandra-driver";

export const mapperForModel = {
  get: jest.fn(),
  findAll: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  mapWithQuery: jest.fn(),
};

export const mapper: mapping.Mapper = {
  batch: jest.fn(),
  forModel: jest.fn().mockReturnValue(mapperForModel),
};
