import { clsx } from "clsx";
import { KeyboardEventHandler, useState } from "react";
import { v4 as uuid } from "uuid";
import { addTaskDB } from "./kanbanActions";
import { useZustand } from "./model";

interface AddModalProps {
  stateId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddTaskModal({ isOpen, onClose, stateId }: AddModalProps) {
  const user = useZustand((store) => store.user);
  const taskList = useZustand((store) =>
    stateId ? store.tasksOrder[stateId] : [],
  );
  const addTask = useZustand((store) => store.addTask);
  const [title, setTitle] = useState("");
  const isError = title === "";

  const handleAddTask = () => {
    if (!user || !stateId) return;
    const newTask = {
      text: title,
      stateId,
      id: uuid(),
      position: taskList.length,
      owner: user.email,
    };
    addTaskDB(newTask);
    addTask(newTask);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTitle("");
  };

  const submitOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && !isError) {
      handleAddTask();
    }
  };

  return (
    <div
      className={clsx("modal", isOpen && "is-active")}
      role="dialog"
      aria-labelledby="add-task-modal-title"
    >
      <div className="modal-background" onClick={handleClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p id="add-task-modal-title" className="modal-card-title">
            Add Task
          </p>
          <button
            className="delete"
            aria-label="close"
            onClick={handleClose}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="field">
            <label className="label">Name:</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyUp={submitOnEnter}
                autoFocus
              />
            </div>
            {!isError ? (
              <p className="help">Add a task to the list.</p>
            ) : (
              <p className="help is-danger">Task is required.</p>
            )}
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={handleClose}>
            Close
          </button>
          <button
            className="button is-success"
            onClick={handleAddTask}
            disabled={isError}
          >
            Add Task
          </button>
        </footer>
      </div>
    </div>
  );
}
