import { TaskRepository } from "./TaskRepository";
import { TaskDTO } from "./TaskDTO";

const mapper = {
  get: jest.fn(),
  findAll: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  mapWithQuery: jest.fn(),
};

jest.mock("../CassandraClient", () => ({
  mapper: {
    forModel: jest.fn(() => mapper),
  },
}));

describe("TaskRepository", () => {
  let taskRepository: TaskRepository;

  beforeEach(() => {
    taskRepository = new TaskRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const userId = "user123";
  const stateId = "state123";
  const task: TaskDTO = {
    id: "1",
    text: "text",
    stateId: stateId,
    position: 1,
    owner: userId,
  };
  const tasks: TaskDTO[] = [
    {
      id: "task1",
      text: "Task 1",
      stateId: stateId,
      position: 1,
      owner: userId,
    },
    {
      id: "task2",
      text: "Task 2",
      stateId: stateId,
      position: 2,
      owner: userId,
    },
  ];

  it("listByUserId should return a list of tasks for a given user", async () => {
    mapper.mapWithQuery.mockReturnValue(async (params: { id: string }) => {
      return tasks.filter((task) => task.owner === params.id);
    });

    const result = await taskRepository.listByUserId(userId);

    expect(result).toEqual(tasks);
    expect(mapper.mapWithQuery).toHaveBeenCalledWith(
      `SELECT * FROM tasks WHERE owner = ?`,
      expect.any(Function),
    );
  });

  it("findById should return a task by ID", async () => {
    mapper.get.mockResolvedValue(task);

    const result = await taskRepository.findById("1");

    expect(result).toEqual(task);
    expect(mapper.get).toHaveBeenCalledWith({ id: "1" });
  });

  it("findById should throw an error if task is not found", async () => {
    mapper.get.mockResolvedValue(null);

    await expect(taskRepository.findById("1")).rejects.toThrowError(
      "Task not found",
    );
  });

  it("list should return a list of tasks", async () => {
    mapper.findAll.mockResolvedValue(tasks);

    const result = await taskRepository.list();

    expect(result).toEqual(tasks);
    expect(mapper.findAll).toHaveBeenCalled();
  });

  it("create should insert a task and return the first result", async () => {
    const insertResult = { first: () => task };
    mapper.insert.mockResolvedValue(insertResult);

    const result = await taskRepository.create(task);

    expect(result).toEqual(task);
    expect(mapper.insert).toHaveBeenCalledWith(task);
  });

  it("update should update a task and return the first result", async () => {
    const updatedTask: TaskDTO = {
      id: "10",
      text: "updatedText",
      stateId: "updatedStateId",
      position: 4,
      owner: "updatedOwner",
    };
    const updatedResult = { first: () => updatedTask };
    mapper.update.mockResolvedValue(updatedResult);

    const result = await taskRepository.update(updatedTask);

    expect(result).toEqual(updatedTask);
    expect(mapper.update).toHaveBeenCalledWith(updatedTask);
  });

  it("delete should remove a task by ID", async () => {
    await taskRepository.delete("1");
    expect(mapper.remove).toHaveBeenCalledWith({ id: "1" });
  });
});
