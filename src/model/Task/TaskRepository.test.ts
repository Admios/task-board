import { mapper } from "../CassandraClient";
import { TaskDTO } from "./TaskDTO";
import { TaskRepository } from "./TaskRepository";

jest.mock("../CassandraClient");

afterEach(() => {
  jest.clearAllMocks();
});

it("listByStateIdList should return a list of tasks for a given list of states", async () => {
  const stateIds = ["stateId1", "stateId2"];
  const tasks: TaskDTO[] = [
    {
      id: "task1",
      text: "Task 1",
      stateId: stateIds[0],
      position: 1,
    },
    {
      id: "task2",
      text: "Task 2",
      stateId: stateIds[1],
      position: 2,
    },
  ];

  const queryMock = jest.fn().mockResolvedValue({
    toArray: () => tasks,
  });
  (mapper.forModel as jest.Mock).mockReturnValue({
    mapWithQuery: jest.fn().mockReturnValue(queryMock),
  });

  const taskRepository = new TaskRepository();
  const result = await taskRepository.listByStateIdList(stateIds);

  expect(result).toEqual(tasks);
  expect(queryMock).toHaveBeenCalledWith(expect.objectContaining({ stateIds }));
});
