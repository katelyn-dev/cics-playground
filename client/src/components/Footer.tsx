import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  console.log("called header")
  return (

      <footer className={styles.footer}>
        <p>2024 Hong Kong Canadians Hackathon
          <br />
          <a >Team 3</a></p>
      </footer>

  )
};

export default Footer
