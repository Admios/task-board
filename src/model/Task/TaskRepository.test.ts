import { TaskDTO } from "./TaskDTO";
import { TaskRepository } from "./TaskRepository";
import { mapper } from "../CassandraClient";

jest.mock("../CassandraClient");

describe("TaskRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("listByUserId should return a list of tasks for a given user", async () => {
    const taskRepository: TaskRepository = new TaskRepository();
    const mapperMock = mapper.forModel("");
    const userId = "user123";
    const tasks: TaskDTO[] = [
      {
        id: "task1",
        text: "Task 1",
        stateId: "stateId",
        position: 1,
        owner: userId,
      },
      {
        id: "task2",
        text: "Task 2",
        stateId: "stateId",
        position: 2,
        owner: userId,
      },
    ];

    (mapperMock.mapWithQuery as jest.Mock).mockReturnValue(
      async (params: { id: string }) => {
        const response = tasks.filter((task) => task.owner === params.id);

        return {
          toArray: () => response,
        };
      },
    );

    const result = await taskRepository.listByUserId(userId);

    expect(result).toEqual(tasks);
    expect(mapperMock.mapWithQuery as jest.Mock).toHaveBeenCalledWith(
      `SELECT * FROM tasks WHERE owner = ?`,
      expect.any(Function),
    );
  });
});
