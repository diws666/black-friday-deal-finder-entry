// Friday Finder - Black Friday / Cyber Monday deal finder entry for make.fun (Node 22, standard library only).
// The site lives in this directory's app/ folder: plain static files opened at app/index.html, no build step,
// nothing it runs, styles or shows loads over the network, and every deal links out to its store. The program
// hands it in: it copies app/ and screenshots/ from beside this file to /output and writes /output/dossier.json,
// the summary the judge reads (screenshots, the first load's files and bytes, and the source outline), using the
// vendored make.fun library. Leave vendor/makefun-frontend.ts unchanged: the scorer requires dossier.json to be
// byte for byte what its own copy writes.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(here, 'app');
if (!existsSync(appDir)) throw new Error('app/ directory not found beside main.ts');
if (!existsSync(join(appDir, 'index.html'))) throw new Error('app/index.html not found: the page is required');

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry
// the scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 16 MiB of app files).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
