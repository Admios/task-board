import { TaskDTO } from "./TaskDTO";
import { TaskRepository } from "./TaskRepository";
import { mapper } from "../CassandraClient";

jest.mock("../CassandraClient");

describe("TaskRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("listByStateId should return a list of tasks for a given state", async () => {
    const taskRepository: TaskRepository = new TaskRepository();
    const mapperMock = mapper.forModel("");
    const stateId = "stateId";
    const tasks: TaskDTO[] = [
      {
        id: "task1",
        text: "Task 1",
        stateId: stateId,
        position: 1,
      },
      {
        id: "task2",
        text: "Task 2",
        stateId: stateId,
        position: 2,
      },
    ];

    (mapperMock.mapWithQuery as jest.Mock).mockReturnValue(
      async (params: { id: string }) => {
        const response = tasks.filter((task) => task.stateId === params.id);

        return {
          toArray: () => response,
        };
      },
    );

    const result = await taskRepository.listByStateId(stateId);

    expect(result).toEqual(tasks);
    expect(mapperMock.mapWithQuery as jest.Mock).toHaveBeenCalledWith(
      `SELECT * FROM tasks WHERE state_id = ?`,
      expect.any(Function),
    );
  });
});
