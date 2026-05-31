import type { ImageRow } from '@/content/projects/types';
import FullImage from './FullImage';
import ImageGrid from './ImageGrid';

interface GalleryContainerProps {
  rows: ImageRow[];
}

// Wraps image rows with a uniform gap — 24px desktop, 16px mobile.
// Uses clamp so no JS/client needed here.
export default function GalleryContainer({ rows }: GalleryContainerProps) {
  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        // clamp: 16px at ≤960px viewport, 24px at ≥1440px
        gap:           'clamp(16px, 1.67vw, 24px)',
        width:         '100%',
        flexShrink:    0,
      }}
    >
      {rows.map((row, i) => {
        if (row.type === 'fullImage') {
          return <FullImage key={i} src={row.src} alt={row.alt} badge={row.badge} />;
        }
        return <ImageGrid key={i} cols={row.cols} images={row.images} />;
      })}
    </div>
  );
}
