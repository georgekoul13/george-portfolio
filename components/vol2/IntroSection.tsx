import RevealText from './RevealText';

/**
 * Intro paragraph — Figma node 100:3492. Checked against the design: full
 * width, 60px horizontal / 124px vertical padding, 72/80 Montserrat Regular
 * in neutral/50, and exactly three permanently-underlined words — George,
 * Product, Visual.
 *
 * Annotation: "The reveal animation will be like the 2nd section of
 * https://gsap.com/ … The underline on hover should reveal TO images."
 *
 * The only block on the page with a hover-reveal image, and now only on
 * "George" — Product and Visual keep their underline and their arrival but
 * are no longer doors to anything. Copy is not final.
 *
 * NOTE: the image below is a stand-in pulled from existing project assets so
 * the interaction can be seen working. Swap for the real photo of George.
 */
const REVEALS = {
  George: '/images/projects/orbit/gaspar-ai-2.png',
};

/** Figma's permanent underlines, minus the one that opens an image. */
const UNDERLINED = ['Product', 'Visual'];

/**
 * Not underlined — the design has exactly three rules and these would be two
 * more. They get the arrival beat only, which is the emphasis without the
 * decoration.
 */
const BEATS = ['facts', 'not only aesthetics'];

export default function IntroSection() {
  return (
    <section id="intro" className="flex w-full items-center px-[var(--gutter)] py-[124px]">
      <RevealText
        className="flex-1"
        reveals={REVEALS}
        underlined={UNDERLINED}
        beats={BEATS}
      >
        {`Hello there! I’m George, a Product & Visual Designer based in Greece. Let’s create stories that are based on facts and not only aesthetics.`}
      </RevealText>
    </section>
  );
}
