'use client';

import { useState } from 'react';
import styles from './TabbedLeagues.module.css';

interface League {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  image?: string;
}

export default function TabbedLeagues({ leagues }: { leagues: League[] }) {
  const [activeId, setActiveId] = useState(leagues[0]?.id);

  const activeLeague = leagues.find(l => l.id === activeId) || leagues[0];

  return (
    <div className={styles.container}>
      <div className={styles.tabsList}>
        {leagues.map((league) => (
          <button
            key={league.id}
            className={`${styles.tab} ${activeId === league.id ? styles.activeTab : ''}`}
            onClick={() => setActiveId(league.id)}
          >
            {league.title}
          </button>
        ))}
      </div>
      <div className={styles.viewer}>
        {activeLeague && (
          <div className={styles.viewerContent}>
            {activeLeague.image && (
              <div 
                className={styles.viewerImage} 
                style={{ backgroundImage: `url(${activeLeague.image})` }} 
              />
            )}
            <div className={styles.viewerTextContainer}>
              <h3 className={styles.viewerTitle}>{activeLeague.title}</h3>
              <p className={styles.viewerExcerpt}>{activeLeague.excerpt}</p>
              <a href={activeLeague.link} className={styles.viewerLink}>
                View League Details &rarr;
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
