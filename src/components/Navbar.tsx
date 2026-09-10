'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/newlogo.png" alt="ICTA Logo" width={100} height={60} style={{ width: 'auto', height: '60px' }} className={styles.logoImage} />
            <span className={styles.logoText}>InterCounty Tennis Association</span>
          </Link>
        </div>
        <div className={styles.desktopMenu}>
          <ul className={styles.navLinks}>
            <li><Link href="/" className={styles.navLink}>Home</Link></li>
            <li className={styles.dropdown}>
              <span className={styles.navLink} style={{ cursor: 'pointer' }}>Leagues ▾</span>
              <ul className={styles.dropdownContent}>
                <li><Link href="/mixed-league" className={styles.dropdownLink}>Mixed League</Link></li>
                <li><Link href="/ladies-league" className={styles.dropdownLink}>Ladies League</Link></li>
                <li><Link href="/55-league" className={styles.dropdownLink}>+55 League</Link></li>
                <li><Link href="/junior-league" className={styles.dropdownLink}>Junior League</Link></li>
                <li><Link href="/tennis-rocks" className={styles.dropdownLink}>Tennis Rocks</Link></li>
              </ul>
            </li>
            <li><Link href="#clubs" className={styles.navLink}>Clubs</Link></li>
            <li><Link href="#news" className={styles.navLink}>News</Link></li>
            <li><Link href="/about-us" className={styles.navLink}>About</Link></li>
          </ul>
        </div>

        <div className={styles.navActions}>
          <button 
            className={`${styles.hamburger} ${isOpen ? styles.open : ''}`} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>

        <div className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}>
          <ul className={styles.mobileNavLinks}>
            <li><Link href="/" className={styles.navLink} onClick={closeMenu}>Home</Link></li>
            <li className={styles.mobileDropdown}>
              <span className={styles.navLink} style={{ cursor: 'default' }}>Leagues ▾</span>
              <ul className={styles.mobileDropdownContent}>
                <li><Link href="/mixed-league" className={styles.dropdownLink} onClick={closeMenu}>Mixed League</Link></li>
                <li><Link href="/ladies-league" className={styles.dropdownLink} onClick={closeMenu}>Ladies League</Link></li>
                <li><Link href="/55-league" className={styles.dropdownLink} onClick={closeMenu}>+55 League</Link></li>
                <li><Link href="/junior-league" className={styles.dropdownLink} onClick={closeMenu}>Junior League</Link></li>
                <li><Link href="/tennis-rocks" className={styles.dropdownLink} onClick={closeMenu}>Tennis Rocks</Link></li>
              </ul>
            </li>
            <li><Link href="#clubs" className={styles.navLink} onClick={closeMenu}>Clubs</Link></li>
            <li><Link href="#news" className={styles.navLink} onClick={closeMenu}>News</Link></li>
            <li><Link href="/about-us" className={styles.navLink} onClick={closeMenu}>About</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
