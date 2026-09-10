import React from 'react';
import styles from './GlassCard.module.css';
import Link from 'next/link';

interface GlassCardProps {
  title: string;
  excerpt: string;
  date?: string;
  link?: string;
  image?: string;
  iconRight?: string;
  htmlContent?: string;
}

export default function GlassCard({ title, excerpt, date, link, image, iconRight, htmlContent }: GlassCardProps) {
  return (
    <div className={`${styles.card} glass-panel`}>
      {image && (
        <div className={styles.imageContainer}>
          {/* Using a regular img tag or placeholder for simplicity, next/image could be used for optimization */}
          <img src={image} alt={title} className={styles.image} />
        </div>
      )}
      {iconRight && (
        <div className={styles.iconRight}>
          <img src={iconRight} alt="Icon" />
        </div>
      )}
      <div className={styles.content}>
        {date && <span className={styles.date}>{date}</span>}
        <h3 className={styles.title}>{title}</h3>
        {htmlContent ? (
          <div 
            className={`${styles.excerpt} ${styles.htmlExcerpt}`} 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        ) : (
          <p className={styles.excerpt}>{excerpt}</p>
        )}
        {link && (
          <Link href={link} className={styles.readMore}>
            Read More &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
