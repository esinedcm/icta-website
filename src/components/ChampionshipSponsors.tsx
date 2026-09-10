'use client';

import styles from './ChampionshipSponsors.module.css';

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  link?: string;
}

interface ChampionshipSponsorsProps {
  sponsors: Sponsor[];
}

export default function ChampionshipSponsors({ sponsors }: ChampionshipSponsorsProps) {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <div className={`${styles.container} glass-panel`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Thank You to our 2026 ICTA Championship Sponsors!</h2>
        <p className={styles.subtitle}>Your support makes our annual tournament a tremendous success.</p>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.sponsorGrid}>
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className={styles.sponsorItem}>
              {sponsor.link ? (
                <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className={styles.sponsorLink}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sponsor.logoUrl} alt={sponsor.name} className={styles.sponsorLogo} />
                </a>
              ) : (
                <div className={styles.sponsorLink}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sponsor.logoUrl} alt={sponsor.name} className={styles.sponsorLogo} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
