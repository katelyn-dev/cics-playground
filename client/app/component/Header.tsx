import React from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {

    return (
      <header className={styles.header}>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" legacyBehavior>
                <a className={styles.navLink}>Home</a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/Form" legacyBehavior>
                <a className={styles.navLink}>Form</a>
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      </header>
    );
};

export default Header;
