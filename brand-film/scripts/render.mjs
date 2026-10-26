// Frame-accurate renderer: seeks the page to each frame time, screenshots it, and pipes PNGs to ffmpeg.
//
//   node scripts/render.mjs                         full film → output/brand-film_1080p60.mp4
//   node scripts/render.mjs --fps 30 --workers 4    faster draft
//   node scripts/render.mjs --stills 0.5,3.2,12     PNG stills → output/stills/
//   node scripts/render.mjs --from 10 --to 14       render a time range only (draft check)
//   node scripts/render.mjs --config my.config.json use another brand config (path relative to project root)
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { serve, ROOT } from './serve.mjs';

// createRequire so a globally installed Playwright (NODE_PATH) or a local `npm install` both resolve.
const { chromium } = createRequire(import.meta.url)('playwright');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]] : a), []));
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, 'timeline.json'), 'utf8'));
const FPS = +(args.fps || TL.fps), W = TL.width, H = TL.height;
const WORKERS = +(args.workers || 4);
const OUT = path.join(ROOT, 'output');
fs.mkdirSync(OUT, { recursive: true });

const server = await serve(0);
const url = `http://127.0.0.1:${server.address().port}/src/index.html?render=1` + (args.config ? `&config=${encodeURIComponent('../' + args.config)}` : '');
// One browser per worker: pages in a shared browser serialise on its single compositor process.
const browsers = [];
async function newPage() {
  const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none'] });
  browsers.push(browser);
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: +(args.scale || 1) });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => { if (!r.url().endsWith('score.wav')) errors.push('request failed: ' + r.url()); });
  await page.goto(url);
  await page.waitForFunction(() => window.FILM && window.FILM.ready, null, { timeout: 30000 });
  if (errors.length) throw new Error('Page errors:\n' + errors.join('\n'));
  return { page, errors };
}
const shot = async (page, t) => { await page.evaluate(t => window.FILM.seek(t), t); return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } }); };

if (args.stills) {
  const dir = path.join(OUT, 'stills'); fs.mkdirSync(dir, { recursive: true });
  const { page, errors } = await newPage();
  const fr = await page.evaluate(() => window.FILM.fitReport);
  console.log('fit report:', JSON.stringify(fr));
  for (const t of String(args.stills).split(',').map(Number)) {
    const f = path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.png`);
    fs.writeFileSync(f, await shot(page, t));
    console.log('wrote', path.relative(ROOT, f));
  }
  if (errors.length) console.error('Page errors:', errors);
} else {
  const from = +(args.from || 0), to = +(args.to || TL.duration);
  const total = Math.round((to - from) * FPS);
  const segDir = path.join(OUT, '.segments'); fs.rmSync(segDir, { recursive: true, force: true }); fs.mkdirSync(segDir, { recursive: true });
  const per = Math.ceil(total / WORKERS);
  const t0 = Date.now();
  let done = 0;
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const a = w * per, b = Math.min(total, a + per);
    if (a >= b) return;
    const { page, errors } = await newPage();
    // Near-lossless intermediate per worker; final encode happens once in mux step.
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-qp', '0', '-pix_fmt', 'yuv444p', path.join(segDir, `seg${w}.mkv`)], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = a; f < b; f++) {
      const buf = await shot(page, from + f / FPS);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (++done % 120 === 0) console.log(`${done}/${total} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg exit ' + c))));
    if (errors.length) throw new Error('Page errors during render:\n' + errors.join('\n'));
  }));
  const list = path.join(segDir, 'list.txt');
  fs.writeFileSync(list, Array.from({ length: WORKERS }, (_, w) => `file 'seg${w}.mkv'`).filter((_, w) => w * per < total).join('\n'));
  const name = args.out || (from === 0 && to === TL.duration ? `brand-film_1080p${FPS}.mp4` : `draft_${from}-${to}.mp4`);
  const audio = path.join(OUT, 'audio', 'score.wav');
  const hasAudio = fs.existsSync(audio) && !args.noaudio;
  const ffArgs = ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list];
  if (hasAudio) ffArgs.push('-ss', String(from), '-t', String(to - from), '-i', audio);
  ffArgs.push('-map', '0:v', ...(hasAudio ? ['-map', '1:a', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000'] : []),
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
    '-c:v', 'libx264', '-preset', args.preset || 'slow', '-crf', String(args.crf || 14), '-profile:v', 'high', '-tune', 'animation',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-movflags', '+faststart', '-shortest', path.join(OUT, name));
  await new Promise((res, rej) => spawn('ffmpeg', ffArgs, { stdio: 'inherit' }).on('close', c => c === 0 ? res() : rej(new Error('mux failed ' + c))));
  fs.rmSync(segDir, { recursive: true, force: true });
  console.log(`wrote output/${name}  (${total} frames, ${((Date.now() - t0) / 1000).toFixed(0)}s, audio: ${hasAudio})`);
}
await Promise.all(browsers.map(b => b.close()));
server.close();
