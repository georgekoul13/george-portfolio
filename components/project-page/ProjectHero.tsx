'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import DraggableItem   from '@/components/project-page/DraggableItem';

interface ProjectHeroProps {
  title:       string;
  description: string;
  metadata: {
    role:       string;
    categories: string[];
    employer:   string;
  };
  /** When true, each hero sub-element is independently draggable */
  isFun?: boolean;
}

export default function ProjectHero({
  title,
  description,
  metadata,
  isFun = false,
}: ProjectHeroProps) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           isMobile ? '32px' : '48px',
        width:         '100%',
        flexShrink:    0,
      }}
    >
      {/* ── Title + description ────────────────────────────────────────────── */}
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           isMobile ? '24px' : '48px',
          width:         isMobile ? '100%' : '70%',
          flexShrink:    0,
        }}
      >
        {/* Title — independently draggable */}
        <DraggableItem label="title" enabled={isFun}>
          <h1
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 600,
              fontSize:   'clamp(40px, 7.78vw, 112px)',
              lineHeight: 1,
              color:      '#EEE2D9',
              margin:     0,
            }}
          >
            {title}
          </h1>
        </DraggableItem>

        {/* Description — independently draggable */}
        <DraggableItem label="description" enabled={isFun}>
          <p
            style={{
              fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight:    300,
              fontSize:      '12px',
              lineHeight:    '18px',
              color:         '#B5A496',
              letterSpacing: '0.24px',
              margin:        0,
            }}
          >
            {description}
          </p>
        </DraggableItem>
      </div>

      {/* ── Metadata row — each field independently draggable ─────────────── */}
      <div
        style={{
          display:       'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap:           isMobile ? '16px' : '56px',
          width:         '100%',
          fontFamily:    'var(--font-montserrat), Montserrat, sans-serif',
          fontWeight:    400,
          fontSize:      '16px',
          letterSpacing: '0.32px',
          flexShrink:    0,
        }}
      >
        {/* 01 MY ROLE */}
        <DraggableItem label="role" enabled={isFun}>
          <div
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           '8px',
              flex:          isMobile ? 'none' : '1 0 0',
              width:         isMobile ? '100%' : undefined,
              minWidth:      0,
            }}
          >
            <p style={{ margin: 0, color: '#B5A496', lineHeight: '16px', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              01 MY ROLE
            </p>
            <p
              style={{
                margin:        0,
                color:         '#EEE2D9',
                lineHeight:    isMobile ? '20px' : '28px',
                fontSize:      isMobile ? '14px' : '16px',
                letterSpacing: isMobile ? '0.28px' : '0.32px',
                textTransform: 'uppercase',
              }}
            >
              {metadata.role}
            </p>
          </div>
        </DraggableItem>

        {/* 02 CATEGORIES */}
        <DraggableItem label="categories" enabled={isFun}>
          <div
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           '8px',
              width:         isMobile ? '100%' : '200px',
              flexShrink:    0,
            }}
          >
            <p style={{ margin: 0, color: '#B5A496', lineHeight: '16px', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              02 CATEGORIES
            </p>
            <div
              style={{
                color:         '#EEE2D9',
                lineHeight:    isMobile ? '20px' : '28px',
                fontSize:      isMobile ? '14px' : '16px',
                letterSpacing: isMobile ? '0.28px' : '0.32px',
                textTransform: 'uppercase',
              }}
            >
              {metadata.categories.map((cat, i) => (
                <p key={i} style={{ margin: 0 }}>
                  {cat}{i < metadata.categories.length - 1 ? ',' : ''}
                </p>
              ))}
            </div>
          </div>
        </DraggableItem>

        {/* 03 EMPLOYER */}
        <DraggableItem label="employer" enabled={isFun}>
          <div
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           '8px',
              width:         isMobile ? '100%' : '200px',
              flexShrink:    0,
            }}
          >
            <p style={{ margin: 0, color: '#B5A496', lineHeight: '16px', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              03 EMPLOYER
            </p>
            <p
              style={{
                margin:        0,
                color:         '#EEE2D9',
                lineHeight:    isMobile ? '20px' : '28px',
                fontSize:      isMobile ? '14px' : '16px',
                letterSpacing: isMobile ? '0.28px' : '0.32px',
                textTransform: 'uppercase',
              }}
            >
              {metadata.employer}
            </p>
          </div>
        </DraggableItem>
      </div>
    </div>
  );
}
