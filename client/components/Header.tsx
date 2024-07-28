import React from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
    console.log("called header")
    return (
      <header className={styles.header}>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/form" className={styles.navLink}>
                Form
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      </header>
    );
};

export default Header;
