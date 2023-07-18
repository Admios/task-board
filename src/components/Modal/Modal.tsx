import React, { useState } from 'react';

interface ModalProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    columnTitle: string;
    addItem: (task: string, column?: string) => void;
  }

  const Modal: React.FC<ModalProps> = ({ setShowModal, addItem }) => {
  const [task, setTask] = useState('');

  return (
    <>
      <div className="modal">
        <div className="modalWrapper">
          <h3>Add task</h3>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <div className="actionButtons">
            <button  onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button onClick={() => addItem(task)}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
