// After a release: wait until jsDelivr serves the new tag, then print the preview link.
// Right after a push jsDelivr can answer 404 for a few minutes (README → Preview).
import { readFileSync } from 'node:fs';

const REPO = 'Timberstore/timberstore';
const FILES = ['dist/timber.min.js', 'dist/timber.min.css'];
const TIMEOUT_MS = 10 * 60 * 1000;
const INTERVAL_MS = 15 * 1000;
const NEEDED_OK = 3; // consecutive fresh lookups, so most jsDelivr edges know the tag

const tag = `v${JSON.parse(readFileSync('package.json', 'utf8')).version}`;
const url = (file) => `https://cdn.jsdelivr.net/gh/${REPO}@${tag}/${file}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function servesTag() {
  for (const file of FILES) {
    // Random query = fresh lookup instead of a cached answer.
    const res = await fetch(`${url(file)}?check=${Date.now()}`).catch(() => null);
    if (!res?.ok) return false;
    if (file.endsWith('.js') && !(await res.text()).includes(tag)) return false;
  }
  return true;
}

const start = Date.now();
let ok = 0;
process.stdout.write(`Waiting for jsDelivr to serve ${tag} `);
while (ok < NEEDED_OK) {
  if (Date.now() - start > TIMEOUT_MS) {
    console.error(`\njsDelivr still does not serve ${tag} after 10 min. Do not send the link yet.`);
    process.exit(1);
  }
  ok = (await servesTag()) ? ok + 1 : 0;
  process.stdout.write(ok ? '+' : '.');
  if (ok < NEEDED_OK) await sleep(ok ? 2000 : INTERVAL_MS);
}

// Drop any 404 an edge may still hold for the plain URLs.
await Promise.all(
  FILES.map((f) => fetch(url(f).replace('cdn.jsdelivr.net', 'purge.jsdelivr.net')).catch(() => null)),
);

console.log(`\njsDelivr serves ${tag}.`);
console.log(`Preview: https://www.timberstore.sk/?ts_preview=${tag}`);
