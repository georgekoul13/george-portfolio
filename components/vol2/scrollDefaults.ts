import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Site-wide ScrollTrigger behaviour for vol2.
 *
 * Import this for its side effect anywhere a scroll-driven entrance is
 * created — it runs at module evaluation, so it is always in place before a
 * component's `useGSAP` builds its triggers.
 *
 * `play none none reverse` is the whole point: the four slots are
 * onEnter / onLeave / onEnterBack / onLeaveBack, so an entrance plays coming
 * down the page and runs backwards on the way up, rather than freezing where
 * it finished. Scrolling back up now un-does what scrolling down did,
 * everywhere.
 *
 * This does nothing to scrubbed triggers — a `scrub` already ties progress
 * directly to scroll position in both directions, so `toggleActions` is
 * ignored there. It only affects the fire-and-forget entrances.
 *
 * A trigger that genuinely should happen once still can: pass `once: true`
 * explicitly, which overrides this.
 */
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({ toggleActions: 'play none none reverse' });

export {};
