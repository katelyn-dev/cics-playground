// Card.tsx
import React from 'react';
import styles from '../styles/Card.module.css'; // Adjust the path as necessary

interface CardProps {
  class_name_eng: string;
  class_name_zhcn: string;
  class_name_zhhk: string;
  target_audience: string;
  class_group_id: string;
  start_time: string;
  class_end: string;
  onSelect: (id: string) => void; // Callback for the select button
}

const Card: React.FC<CardProps> = ({
  class_name_eng,
  class_name_zhcn,
  class_name_zhhk,
  target_audience,
  class_group_id,
  start_time,
  class_end,
  onSelect,
}) => {
  return (
    <div className={styles.card}>
      <h2>{class_name_eng}</h2>
      <p>{class_name_zhcn}</p>
      <p>{class_name_zhhk}</p>
      <p>ID: {class_group_id}</p>
      <p>Target: {target_audience}</p>
      <p>Start Time: {start_time}</p>
      <p>End Time: {class_end}</p>
      <button className={styles.selectButton} onClick={() => onSelect(class_group_id)}>
        Select
      </button>
    </div>
  );
};

export default Card;