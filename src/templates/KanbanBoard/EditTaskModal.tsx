import { clsx } from "clsx";
import { KeyboardEventHandler, useState } from "react";
import { editTaskDB } from "./kanbanActions";
import { Task, useZustand } from "./model";

interface AddModalProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTaskModal({ isOpen, onClose, task }: AddModalProps) {
  const editTask = useZustand((store) => store.editTask);
  const [text, setText] = useState("");
  const isError = text === "";

  const handleEditTask = () => {
    if (!task) return;
    const taskUpdate = { ...task, text };
    editTaskDB(taskUpdate);
    editTask(taskUpdate.id, { ...taskUpdate, text });
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setText("");
  };

  const submitOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && !isError) {
      handleEditTask();
    }
  };

  return (
    <div className={clsx("modal", isOpen && "is-active")}>
      <div className="modal-background" onClick={handleClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Edit Task</p>
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
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyUp={submitOnEnter}
                autoFocus
              />
            </div>
            {!isError ? (
              <p className="help">Edit this task.</p>
            ) : (
              <p className="help is-danger">Text is required.</p>
            )}
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={handleClose}>
            Close
          </button>
          <button
            className="button is-success"
            onClick={handleEditTask}
            disabled={isError}
          >
            Edit Task
          </button>
        </footer>
      </div>
    </div>
  );
}
