import React, { useEffect, useState } from 'react';
import Card from './Card'; // Import the Card component
import styles from '../styles/Form.module.css'; // Adjust the import path as necessary

interface Programme {
  class_name_eng: string;
  class_name_zhcn: string;
  class_name_zhhk: string;
  class_group_id: string;
  start_time: string;
  class_end: string;
}

const ProgrammeCard = (programmes:Programme[]) => {
  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        {programmes.length > 0 ? (
          programmes.map(programme => (
            <Card key={programme.class_group_id} {...programme} />
          ))
        ) : (
          <p>No programmes found.</p>
        )}
      </div>
    </div>
  );
};

export default ProgrammeCard;
