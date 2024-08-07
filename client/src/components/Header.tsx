import React from 'react';
import styles from '../styles/Header.module.css';
import { NavLink } from "react-router-dom";
import cicsLogo from '../static/image/cics-logo.png';


interface HeaderProps {
  children?: React.ReactNode;
}
const Header: React.FC<HeaderProps> = ({children}) => {
  console.log("called header")
  return (
    <header className={styles.header}>
       <img src={cicsLogo} alt="CICS Logo" style={{ width: '110px', height: 'auto' }} />
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <NavLink to="/" className={styles.navLink}>
              Programme
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/formCreate" className={styles.navLink}>
              Search & Create Form
            </NavLink>
          </li>
          {/* <li className={styles.navItem}>
            <NavLink to="/form" className={styles.navLink}>
              Form
            </NavLink>
          </li> */}
          <li className={styles.navItem}>
            <NavLink to="/form-editor" className={styles.navLink}>
              Form Editor
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/dashboard" className={styles.navLink}>
              Dashboard
            </NavLink>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
      {children}
    </header>
  );
};

export default Header;
