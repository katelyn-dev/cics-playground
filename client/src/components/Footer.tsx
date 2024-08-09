
import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  return (

      <footer className={styles.footer}>
      <sub style={{ fontFamily: "sans-serif",  font: "bold"}} >2024 Hong Kong Canadians Hackathon
          <br />
          <a >Group 3</a></sub>
      </footer>

  )
};

export default Footer
