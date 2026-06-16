'use client';

import styles from './AdBanner.module.css';

export type AdSlotId = 'AD-01' | 'AD-02' | 'AD-03' | 'AD-04' | 'AD-05';
export type AdSize = 'banner' | 'rectangle';

interface AdBannerProps {
  slotId: AdSlotId;
  size: AdSize;
  className?: string;
  // Future Google AdSense props
  adSenseClient?: string;
  mobileAdSlot?: string;
  tabletAdSlot?: string;
  desktopAdSlot?: string;
}

export default function AdBanner({
  slotId,
  size,
  className = '',
}: AdBannerProps) {
  return (
    <div
      className={`${styles.adBanner} ${size === 'banner' ? styles.banner : styles.rectangle} ${className}`}
      role="complementary"
      aria-label="Espaço publicitário"
    >
      <span className={styles.label}>Espaço Publicitário</span>
      <span className={styles.slotId}>{slotId}</span>
    </div>
  );
}
