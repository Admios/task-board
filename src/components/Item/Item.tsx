import React from 'react';
import '../../App.css';

interface ItemProps {
  data: string;
  color: string;
}

const Item: React.FC<ItemProps> = ({ data, color }) => {
  return (
    <div className="item" style={{ borderTop: `4px solid ${color}` }}>
      {data}
    </div>
  );
};

export default Item;
