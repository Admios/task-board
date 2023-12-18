import { clsx } from "clsx";
import { KeyboardEventHandler, useState } from "react";
import { v4 as uuid } from "uuid";
import { addStateDB } from "./kanbanActions";
import { useZustand } from "./model";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStateModal({ isOpen, onClose }: AddModalProps) {
  const states = useZustand((store) => store.states);
  const addState = useZustand((store) => store.addState);
  const user = useZustand((store) => store.user);
  const [title, setTitle] = useState("");
  const isError = title === "";

  const submit = () => {
    if (!user) {
      return;
    }
    const newState = {
      name: title,
      id: uuid(),
      color: "black",
      position: Object.values(states).length,
      owner: user.email,
    };
    addStateDB(newState);
    addState(newState);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTitle("");
  };

  const submitOnEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && !isError) {
      submit();
    }
  };

  return (
    <div
      className={clsx("modal", isOpen && "is-active")}
      role="dialog"
      aria-labelledby="add-state-modal-title"
    >
      <div className="modal-background" onClick={handleClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p id="add-state-modal-title" className="modal-card-title">
            Add State
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
                className={clsx("input", isError && "is-danger")}
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoFocus
                onKeyUp={submitOnEnter}
              />
            </div>
            {!isError ? (
              <p className="help">The name of the new state.</p>
            ) : (
              <p className="help is-danger">Name is required.</p>
            )}
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={handleClose}>
            Close
          </button>
          <button
            className="button is-success"
            onClick={submit}
            disabled={isError}
          >
            Add State
          </button>
        </footer>
      </div>
    </div>
  );
}
