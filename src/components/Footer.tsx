import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { stripHtml } from '@/lib/utils';
import { draftMode } from 'next/headers';



export default async function Footer() {
  const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );

  const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );

  return (
    <footer className={`${styles.footer} glass-panel`}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <Image src="/newlogo.png" alt="ICTA Logo" width={100} height={72} style={{ width: 'auto', height: '72px', borderRadius: '6px' }} />
        </div>
        <div className={styles.middleColumn}>
          <h3 className={styles.title}>InterCounty Tennis Association</h3>
          <p className={styles.description}>
            Dedicated to the advancement of team tennis in Southern Ontario.
          </p>
        </div>
        <div className={styles.rightColumn}>
          <h4 className={styles.subtitle}>Connect With Us</h4>
          <div className={styles.socialIcons}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="mailto:info@intercountytennis.com" aria-label="Email Us">
              <MailIcon />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} InterCounty Tennis Association. All rights reserved.</p>
      </div>
    </footer>
  );
}
