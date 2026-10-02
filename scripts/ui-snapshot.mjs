// Screenshot every LinguaLens workspace page at mobile and desktop widths for before/after UI review.
// Needs a dev server started with AUTH_MODE=local-test (see docs/testing.md). Writes to artifacts/ui-snapshots/<label>/.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const ALL_PAGES = ['dashboard', 'discover', 'reading', 'vocabulary', 'skill-path', 'tutor', 'voice', 'pronunciation',
    'eye', 'forum', 'library', 'support', 'privacy', 'research', 'admin'];
const ADMIN_PAGES = new Set(['research', 'admin']);

const { values: opt } = parseArgs({
    options: {
        base: { type: 'string', default: process.env.PILOT_TEST_URL || 'http://127.0.0.1:8787' },
        label: { type: 'string', default: new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-') },
        pages: { type: 'string', default: ALL_PAGES.join(',') },
        widths: { type: 'string', default: '375,1280' },
        'reduced-motion': { type: 'boolean', default: false },
        fresh: { type: 'boolean', default: false },
    },
});

const base = opt.base.replace(/\/$/, '');
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('ui-snapshot only runs against localhost.');
const pages = opt.pages.split(',').map(p => p.trim()).filter(Boolean);
const unknown = pages.filter(p => !ALL_PAGES.includes(p));
if (unknown.length) throw new Error(`Unknown page(s): ${unknown.join(', ')}. Known: ${ALL_PAGES.join(', ')}`);
const widths = opt.widths.split(',').map(Number).filter(w => w > 0);
const label = opt.label + (opt['reduced-motion'] ? '-reduced-motion' : '');
const outDir = join('artifacts', 'ui-snapshots', label);
mkdirSync(outDir, { recursive: true });

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { throw new Error('Playwright is missing. Run: npm ci, then npx playwright install chromium'); }

const learner = { 'oai-authenticated-user-id': 'snapshot-learner', 'oai-authenticated-user-email': 'snapshot-learner@sites.test' };
const admin = {
    'oai-authenticated-user-id': 'snapshot-admin',
    'oai-authenticated-user-email': process.env.SNAPSHOT_ADMIN_EMAIL || 'test-admin@sites.test',
};

async function post(headers, body) {
    const response = await fetch(base + '/api/pilot', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Seed "${body.op}" failed (${response.status}). Is the dev server running with AUTH_MODE=local-test?`);
    return response.json();
}

// Default state: a learner with a profile and one unfinished reading session, so #reading shows the reader.
// --fresh skips seeding to capture what a brand-new participant sees.
if (!opt.fresh) {
    const profile = { op: 'profile', name: 'Snapshot', cefr: 'B1', goal: 'Reading', research: false, aiConsent: false };
    await Promise.all([post(learner, profile), post(admin, profile)]);
    await post(learner, { op: 'start', reading: 'campus-cups' });
}

const browser = await chromium.launch();
const report = { base, label, reducedMotion: opt['reduced-motion'], fresh: opt.fresh, createdAt: new Date().toISOString(), shots: [] };
try {
    for (const width of widths) {
        for (const role of ['learner', 'admin']) {
            const rolePages = pages.filter(p => ADMIN_PAGES.has(p) === (role === 'admin'));
            if (!rolePages.length) continue;
            const context = await browser.newContext({
                viewport: { width, height: width < 768 ? 812 : 900 },
                reducedMotion: opt['reduced-motion'] ? 'reduce' : 'no-preference',
                extraHTTPHeaders: role === 'admin' ? admin : learner,
            });
            for (const name of rolePages) {
                const page = await context.newPage();
                const consoleErrors = [], pageErrors = [];
                let snapshotError = null;
                page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
                page.on('pageerror', e => pageErrors.push(String(e).slice(0, 300)));
                const file = `${name}-${width}.png`;
                let status = null;
                try {
                    status = (await page.goto(`${base}/#${name}`, { waitUntil: 'networkidle', timeout: 45000 }))?.status() ?? null;
                    // Wait for the client-side workspace to finish loading before capturing.
                    await page.waitForFunction(() => !document.body.innerText.includes('Đang tải'), null, { timeout: 15000 }).catch(() => {});
                    await page.waitForTimeout(700);
                    await page.screenshot({ path: join(outDir, file), fullPage: true });
                } catch (error) {
                    snapshotError = String(error).slice(0, 300);
                }
                const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth).catch(() => null);
                report.shots.push({ page: name, width, role, file, status, overflowX, snapshotError, consoleErrors, pageErrors });
                const notes = [overflowX && 'horizontal overflow', pageErrors.length && `${pageErrors.length} page errors`, consoleErrors.length && `${consoleErrors.length} console errors`].filter(Boolean);
                console.log(`${snapshotError ? 'FAIL' : 'OK  '} ${file}${notes.length ? ` (${notes.join(', ')})` : ''}`);
                await page.close();
            }
            await context.close();
        }
    }
} finally {
    await browser.close();
    writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2));
}
const failed = report.shots.filter(s => s.snapshotError).length;
const withErrors = report.shots.filter(s => s.pageErrors.length || s.consoleErrors.length).length;
console.log(`\n${report.shots.length - failed}/${report.shots.length} screenshots in ${outDir}; ${withErrors} with console/page errors (see report.json).`);
process.exitCode = failed ? 1 : 0;
