import { Column } from '../models/column';
import { Task } from '../models/task';
import ColumnRepository from '../repositories/columnRepository';
import TaskRepository from '../repositories/taskRepository';

const columnRepo = new ColumnRepository();
const taskRepo = new TaskRepository();

const resolvers = {
    Query: {
        columns: () => columnRepo.findAll(),
        tasks: () => taskRepo.findAll(),
    },
    Mutation: {
        createColumn: (_: any, { name, position, color }: Column) => columnRepo.create({ name, position, color }),
        createTask: (_: any, { text, columnId, position,  }: Task) => taskRepo.create({ text, columnId, position }),
    }
};

export { resolvers };
