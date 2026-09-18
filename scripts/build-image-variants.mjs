/**
 * Pre-render the responsive sizes as REAL FILES.
 *
 * George: *"we definitely need to fix the thing with the images - brainstorm
 * things that could work and do them so the problem is corrected. This is the
 * priority number one for a portfolio."*
 *
 * Every image failure this site has had came from the same place: the
 * `next/image` optimiser resizing on demand. Cold, it took seconds; under a
 * page's worth of parallel requests some never came back at all; and with
 * `loading="lazy"` the browser would not even ask, because these live inside
 * `PanelStack`'s transformed panels and their rect never enters the viewport.
 *
 * None of that is inherent. The sources are already WebP at sensible
 * dimensions — 18.3 MB for all 173, and the heaviest whole page is 2.57 MB —
 * so there is nothing an optimiser needs to do at request time that cannot be
 * done once, here, and served as a static file.
 *
 * Only the 39 images wider than 1600px get extra sizes; the rest are already
 * phone-sized. Variants live in a `r/` subfolder so `build-project-assets`
 * cannot mistake `image 01-760.webp` for a still of its own.
 *
 *   node scripts/build-image-variants.mjs
 */
import { execFileSync } from 'node:child_process';

execFileSync('python3', ['-c', `
import glob, os
from PIL import Image

WIDTHS = [760, 1320]
ROOT = 'public/images/vol2/projects'
made = kept = 0
bytes_ = 0

for src in sorted(glob.glob(ROOT + '/*/*.webp')):
    im = Image.open(src)
    if im.width <= 1600:
        kept += 1
        continue
    folder, name = os.path.split(src)
    out = os.path.join(folder, 'r')
    os.makedirs(out, exist_ok=True)
    stem = name[:-5]
    for w in WIDTHS:
        if w >= im.width:
            continue
        dst = os.path.join(out, f'{stem}-{w}.webp')
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(dst, 'WEBP', quality=88, method=6)
        bytes_ += os.path.getsize(dst)
        made += 1

print(f'{made} variants for {len(glob.glob(ROOT + "/*/r"))} projects, {bytes_/1e6:.1f} MB added')
print(f'{kept} files were already small enough to serve as they are')
`], { stdio: 'inherit', cwd: process.cwd() });
