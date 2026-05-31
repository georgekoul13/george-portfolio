// ─── Project Page Content Types ───────────────────────────────────────────────

// Image rows that can live standalone or grouped inside a gallery
export type ImageRow =
  | { type: 'fullImage'; src: string; alt: string; badge?: string }
  | { type: 'imageGrid'; cols: 2 | 3; images: { src: string; alt: string }[] }

// Each entry in sections[] drives one block on the project page.
export type Section =
  | { type: 'divider' }
  | ImageRow                                // standalone image (no grouping)
  | { type: 'gallery'; rows: ImageRow[] }  // rows share a 24px gap — matches Figma Gallery Container
  | { type: 'textBlock'; body: string }
  | {
      type:         'carousel';
      images:       { src: string; alt: string }[];
      interval?:    number;   // ms per frame — default 1400
      aspectRatio?: string;   // CSS aspect-ratio — default '16 / 9', use '9 / 16' for portrait
    }
  | {
      type:         'scrollSequence';
      images:       { src: string; alt: string }[];
      aspectRatio?: string;   // CSS aspect-ratio — default '16 / 9', use '9 / 16' for portrait
    }
  | {
      // Two portrait columns advancing together — for light/dark or before/after comparisons
      type:         'scrollSequencePair';
      left:         { src: string; alt: string }[];
      right:        { src: string; alt: string }[];
      aspectRatio?: string;   // default '9 / 16' (portrait phone)
      gap?:         string;   // gap between columns, default '16px'
    }
  | {
      // Alternating image-left/right split with a label — used for logo showcase rows
      type:          'splitPanel';
      imagePosition: 'left' | 'right';
      images:        { src: string; alt: string }[];  // 1 = static, 2+ = auto-carousel
      interval?:     number;    // carousel ms, default 2000
      label:         string;    // e.g. "OLGA POSONIDOU"
      sublabel:      string;    // e.g. "Counseling"
    }
  | {
      // Video scrubbed by scroll — currentTime mapped to scroll progress (Vozora-style)
      type:          'scrollVideo';
      src:           string;     // must be .mp4 — .mov won't play in browsers
      poster?:       string;     // optional first-frame image path
      scrollWeight?: number;     // × 100 vh the component claims — default 5
    }
  | {
      // Apple-style scroll narrative — sticky viewport, each project revealed in sequence.
      type: 'logoStoryteller';
      projects: {
        /**
         * 'split'    → text on one side, scroll-linked image carousel on the other (Maria)
         * 'showcase' → full-width image/video at natural aspect ratio, object-fit contain (Olga/Vozora)
         */
        variant?:       'split' | 'showcase';
        imagePosition?: 'left' | 'right';   // only for 'split'
        media: (
          | { kind: 'image'; src: string; alt: string }
          | {
              kind:          'video';
              src:           string;
              poster?:       string;
              /**
               * For showcase videos: how many × 100 vh of scroll the video claims.
               * Scroll position is mapped to video.currentTime so the user must
               * scroll through the ENTIRE video before advancing to the next section.
               * Default: 5 (= 500 vh for a typical 10–20 s clip).
               */
              scrollWeight?: number;
            }
        )[];
        label:     string;
        sublabel?: string;
      }[];
    }
  | {
      type:      'typefaceShowcase';
      name:      string;
      subtitle?: string;
      variant:  'rounded' | 'angular';
      letters: { key: string; src: string; alt: string }[];
    }
  | {
      // Two-column confidentiality / disclaimer banner — label left, bold text right
      type: 'disclaimer';
      text: string;
    }
  | { type: 'moreProjects' }

export interface ProjectContent {
  slug:        string;
  title:       string;
  resolution:  string;   // e.g. "1440 × 900"
  description: string;
  metadata: {
    role:       string;
    categories: string[];
    employer:       string;
  };
  sections: Section[];
}
