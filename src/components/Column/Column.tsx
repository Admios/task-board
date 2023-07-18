import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import Item from '../Item/Item';
import '../../App.css';

interface ColumnProps {
  itemList: string[];
  colTitle: string;
  color: string;
}

const Column: React.FC<ColumnProps> = ({ itemList, colTitle, color }) => {
  const [showModal, setShowModal] = useState(false);

  const openAddNewTaskModal = () => {
    setShowModal(true);
  };

  const addItem = (task: string) => {
    itemList.push(task);
    setShowModal(false);
  };

  return (
    <div className="column">
      <header className="columnHeading">
        <h3>{colTitle}</h3>
      </header>
      <div className="items">
        {itemList.map((item, index) => (
          <Item key={index} data={item} color={color} />
        ))}
      </div>
      <div>
        {showModal && (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            columnTitle={colTitle}
            addItem={addItem}
          />
        )}
      </div>
      <button className="addNew" onClick={openAddNewTaskModal}>
        Add task
      </button>
    </div>
  );
};

export default Column;
