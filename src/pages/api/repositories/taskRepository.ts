import { TaskModel } from '../database/cassandra';
import { BaseRepository } from './baseRepository';

class TaskRepository extends BaseRepository<typeof TaskModel> {
    constructor() {
        super(TaskModel);
    }
}

export default TaskRepository;
