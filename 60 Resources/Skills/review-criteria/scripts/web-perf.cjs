#!/usr/bin/env node
/*
 * web-perf.cjs: measure page-load performance of a URL in headless Chromium.
 *
 * Loads the page several times, each with a fresh cache, under a throttled
 * CPU and network profile, and reports the median and range of TTFB, FCP, LCP
 * (and its element), CLS, TBT, load time, request count and bytes by type,
 * with a check against default budgets. With --click it also clicks an element
 * after load and reports the interaction's latency (the lab stand-in for INP);
 * pick an element that doesn't navigate away.
 * Save runs as JSON and compare base against head with --compare.
 *
 * Usage:
 *   node web-perf.cjs <url> [--runs 10] [--profile mobile|desktop|none]
 *                     [--warmup 1] [--settle 2000] [--click "css selector"]
 *                     [--json out.json] [--compare base.json]
 *                     [--chromium /path/to/chrome]
 *
 * Needs Node 18+ and Playwright with Chromium (npm i -D playwright &&
 * npx playwright install chromium). Run it against a local production build
 * or a preview deploy, never at volume against a site you don't own.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PROFILES = {
  // Close to Lighthouse's mobile defaults, applied as DevTools throttling.
  mobile: {
    label: 'mobile (4x CPU slowdown, 150 ms RTT, 1.6 Mbps down / 750 Kbps up, 412x823 @1.75x)',
    cpu: 4,
    net: { latency: 150, down: 1.6e6 / 8, up: 750e3 / 8 },
    context: {
      viewport: { width: 412, height: 823 },
      deviceScaleFactor: 1.75,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
    },
  },
  desktop: {
    label: 'desktop (no CPU slowdown, 40 ms RTT, 10 Mbps, 1350x940)',
    cpu: 1,
    net: { latency: 40, down: 10e6 / 8, up: 10e6 / 8 },
    context: { viewport: { width: 1350, height: 940 }, deviceScaleFactor: 1 },
  },
  none: {
    label: 'no throttling (1440x900)',
    cpu: 1,
    net: null,
    context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  },
};

// Core Web Vitals "good" thresholds, plus Lighthouse's TBT and common FCP/TTFB targets.
const BUDGETS = { ttfb: 800, fcp: 1800, lcp: 2500, cls: 0.1, tbt: 200, click: 200 };

function parseArgs(argv) {
  const args = { runs: 10, profile: 'mobile', warmup: 1, settle: 2000, click: null, json: null, compare: null, chromium: null, url: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) fail(`Missing value for ${a}`);
      return argv[++i];
    };
    if (a === '--runs') args.runs = Math.max(1, parseInt(next(), 10));
    else if (a === '--profile') args.profile = next();
    else if (a === '--warmup') args.warmup = Math.max(0, parseInt(next(), 10));
    else if (a === '--settle') args.settle = Math.max(0, parseInt(next(), 10));
    else if (a === '--click') args.click = next();
    else if (a === '--json') args.json = next();
    else if (a === '--compare') args.compare = next();
    else if (a === '--chromium') args.chromium = next();
    else if (a === '-h' || a === '--help') usage(0);
    else if (!a.startsWith('--') && !args.url) args.url = a;
    else fail(`Unknown argument: ${a}`);
  }
  if (!args.url) usage(1);
  if (!PROFILES[args.profile]) fail(`Unknown profile "${args.profile}". Use mobile, desktop or none.`);
  try {
    new URL(args.url);
  } catch {
    fail(`Not a valid URL: ${args.url}`);
  }
  return args;
}

function usage(code) {
  console.log('Usage: node web-perf.cjs <url> [--runs 10] [--profile mobile|desktop|none] [--warmup 1] [--settle 2000] [--click "selector"] [--json out.json] [--compare base.json] [--chromium path]');
  process.exit(code);
}

function fail(msg) {
  console.error(`web-perf: ${msg}`);
  process.exit(2);
}

function loadPlaywright() {
  const names = ['playwright', 'playwright-core', '@playwright/test'];
  for (const name of names) {
    try {
      return require(name);
    } catch {}
  }
  try {
    const root = require('child_process').execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    for (const name of names) {
      try {
        return require(path.join(root, name));
      } catch {}
    }
  } catch {}
  fail('Playwright not found. Install it in the project (npm i -D playwright && npx playwright install chromium) and run this script from there.');
}

// Runs inside the page before any of its scripts.
function installObservers() {
  const p = (window.__webPerf = { lcp: null, lcpEl: '', cls: 0, longTasks: [], events: [] });
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        p.lcp = e.startTime;
        const el = e.element;
        let desc = el ? el.tagName.toLowerCase() : '';
        if (el && el.id) desc += '#' + el.id;
        else if (el && typeof el.className === 'string' && el.className.trim()) desc += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
        if (e.url) desc += ' ' + e.url.slice(0, 140);
        else if (el && el.textContent) desc += ' "' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 60) + '"';
        p.lcpEl = desc;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}
  try {
    // CLS as defined by web-vitals: the largest session window of shifts
    // (gaps under 1 s, window under 5 s), ignoring shifts after input.
    let value = 0;
    let entries = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        const first = entries[0];
        const last = entries[entries.length - 1];
        if (value && e.startTime - last.startTime < 1000 && e.startTime - first.startTime < 5000) {
          value += e.value;
          entries.push(e);
        } else {
          value = e.value;
          entries = [e];
        }
        if (value > p.cls) p.cls = value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) p.longTasks.push([e.startTime, e.duration]);
    }).observe({ type: 'longtask', buffered: true });
  } catch {}
  try {
    // Event Timing only reports events of 16 ms or longer.
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (e.interactionId) p.events.push([e.interactionId, e.duration]);
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  } catch {}
}

async function measureOnce(browser, url, profile, settle, clickSelector) {
  const context = await browser.newContext(profile.context);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (profile.net) {
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: profile.net.latency,
      downloadThroughput: profile.net.down,
      uploadThroughput: profile.net.up,
    });
  }
  if (profile.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });

  const types = new Map();
  const bytes = new Map();
  let failed = 0;
  const docTimings = [];
  cdp.on('Network.responseReceived', (e) => {
    types.set(e.requestId, e.type || 'Other');
    if (e.type === 'Document' && e.response && e.response.timing) docTimings.push({ frameId: e.frameId, headersEnd: e.response.timing.receiveHeadersEnd });
  });
  cdp.on('Network.loadingFinished', (e) => bytes.set(e.requestId, e.encodedDataLength || 0));
  cdp.on('Network.loadingFailed', () => failed++);

  await page.addInitScript(installObservers);
  try {
    const response = await page.goto(url, { waitUntil: 'load', timeout: 90000 });
    if (!response) throw new Error('no response');
    if (response.status() >= 400) throw new Error(`HTTP ${response.status()}`);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(settle);

    const m = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      const p = window.__webPerf || {};
      return {
        ttfb: nav.responseStart || null,
        fcp: fcpEntry ? fcpEntry.startTime : null,
        lcp: p.lcp,
        lcpEl: p.lcpEl || '',
        cls: p.cls || 0,
        domContentLoaded: nav.domContentLoadedEventEnd || null,
        load: nav.loadEventEnd || null,
        longTasks: p.longTasks || [],
      };
    });

    // Interaction latency: click once after load, under the same throttling,
    // and take the longest event of that interaction, as INP does.
    let click = null;
    if (clickSelector) {
      await page.click(clickSelector, { timeout: 15000 });
      await page.waitForTimeout(1000);
      const events = await page.evaluate(() => (window.__webPerf && window.__webPerf.events) || []);
      click = events.reduce((max, [, d]) => Math.max(max, d), 0);
    }

    // Navigation Timing leaves out emulated latency; the DevTools timing of
    // the main document's response includes it, so take the larger one.
    try {
      const tree = await cdp.send('Page.getFrameTree');
      const main = docTimings.filter((d) => d.frameId === tree.frameTree.frame.id).pop();
      if (main && typeof main.headersEnd === 'number') m.ttfb = Math.max(m.ttfb || 0, main.headersEnd);
    } catch {}

    // Total Blocking Time: the part of each long task over 50 ms, after FCP.
    const from = m.fcp || 0;
    let tbt = 0;
    for (const [start, duration] of m.longTasks) {
      if (start + duration <= from) continue;
      tbt += Math.max(0, duration - 50);
    }

    const byType = {};
    let total = 0;
    for (const [id, size] of bytes) {
      const group = groupOf(types.get(id));
      byType[group] = (byType[group] || 0) + size;
      total += size;
    }
    return {
      ok: true,
      ttfb: m.ttfb,
      fcp: m.fcp,
      lcp: m.lcp,
      lcpEl: m.lcpEl,
      cls: m.cls,
      tbt,
      click,
      domContentLoaded: m.domContentLoaded,
      load: m.load,
      requests: bytes.size,
      failedRequests: failed,
      bytes: total,
      byType,
    };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  } finally {
    await context.close();
  }
}

function groupOf(type) {
  switch (type) {
    case 'Script': return 'js';
    case 'Stylesheet': return 'css';
    case 'Image': return 'img';
    case 'Font': return 'font';
    case 'Media': return 'media';
    case 'Document': return 'html';
    case 'XHR':
    case 'Fetch': return 'data';
    default: return 'other';
  }
}

function stats(values) {
  const v = values.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = Math.floor(v.length / 2);
  const median = v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
  return { median, min: v[0], max: v[v.length - 1], n: v.length };
}

function summarize(runs) {
  const ok = runs.filter((r) => r.ok);
  const s = {};
  for (const k of ['ttfb', 'fcp', 'lcp', 'cls', 'tbt', 'click', 'domContentLoaded', 'load', 'requests', 'bytes']) s[k] = stats(ok.map((r) => r[k]));
  s.byType = {};
  for (const g of ['html', 'js', 'css', 'img', 'font', 'media', 'data', 'other']) {
    const st = stats(ok.map((r) => (r.byType && r.byType[g]) || 0));
    if (st && st.max > 0) s.byType[g] = st;
  }
  const els = {};
  for (const r of ok) if (r.lcpEl) els[r.lcpEl] = (els[r.lcpEl] || 0) + 1;
  s.lcpElement = Object.entries(els).sort((a, b) => b[1] - a[1]).map(([el, n]) => `${el} (${n}/${ok.length} runs)`)[0] || 'not reported';
  s.okRuns = ok.length;
  s.failedRuns = runs.length - ok.length;
  return s;
}

const fmtClick = (x) => (x == null ? 'n/a' : x < 16 ? 'under 16 ms' : `${Math.round(x)} ms`);
const fmtMs = (x) => (x == null ? 'n/a' : x >= 1000 ? `${(x / 1000).toFixed(2)} s` : `${Math.round(x)} ms`);
const fmtCls = (x) => (x == null ? 'n/a' : x.toFixed(3));
const fmtBytes = (x) => (x == null ? 'n/a' : x >= 1024 * 1024 ? `${(x / 1024 / 1024).toFixed(2)} MB` : `${(x / 1024).toFixed(1)} KB`);
const fmtCount = (x) => (x == null ? 'n/a' : String(Math.round(x)));

function deltaText(head, base, fmt, isCls) {
  if (head == null || base == null) return '';
  const d = head - base;
  const sign = d >= 0 ? '+' : '-';
  const pct = base ? ` (${sign}${Math.abs(Math.round((d / base) * 100))}%)` : '';
  const abs = Math.abs(d);
  return `${sign}${isCls ? abs.toFixed(3) : fmt(abs)}${pct}`;
}

function printReport(args, profile, summary, base) {
  const rows = [
    ['TTFB', 'ttfb', fmtMs, BUDGETS.ttfb],
    ['FCP', 'fcp', fmtMs, BUDGETS.fcp],
    ['LCP', 'lcp', fmtMs, BUDGETS.lcp],
    ['CLS', 'cls', fmtCls, BUDGETS.cls],
    ['TBT', 'tbt', fmtMs, BUDGETS.tbt],
    ...(summary.click ? [['Click latency', 'click', fmtClick, BUDGETS.click]] : []),
    ['DOMContentLoaded', 'domContentLoaded', fmtMs, null],
    ['Load event', 'load', fmtMs, null],
    ['Requests', 'requests', fmtCount, null],
    ['Transferred', 'bytes', fmtBytes, null],
  ];
  console.log(`\nweb-perf: ${args.url}`);
  console.log(`Profile: ${profile.label}`);
  if (args.click) console.log(`Click: "${args.click}", once per run after load`);
  console.log(`Runs: ${summary.okRuns} measured${summary.failedRuns ? `, ${summary.failedRuns} failed` : ''}, fresh cache each, after ${args.warmup} warm-up run(s)\n`);
  const head = base ? '| Metric | Median | Range | Base median | Change | Budget | |' : '| Metric | Median | Range | Budget | |';
  console.log(head);
  console.log(base ? '|---|---|---|---|---|---|---|' : '|---|---|---|---|---|');
  for (const [label, key, fmt, budget] of rows) {
    const st = summary[key];
    const med = st ? fmt(st.median) : 'n/a';
    const range = st ? `${fmt(st.min)} to ${fmt(st.max)}` : '';
    const budgetText = budget == null ? '' : `≤ ${key === 'cls' ? budget : fmtMs(budget)}`;
    const ok = budget == null || !st ? '' : st.median <= budget ? 'ok' : 'OVER';
    if (base) {
      const b = base[key];
      console.log(`| ${label} | ${med} | ${range} | ${b ? fmt(b.median) : 'n/a'} | ${st && b ? deltaText(st.median, b.median, fmt, key === 'cls') : ''} | ${budgetText} | ${ok} |`);
    } else {
      console.log(`| ${label} | ${med} | ${range} | ${budgetText} | ${ok} |`);
    }
  }
  const parts = Object.entries(summary.byType).map(([g, st]) => `${g} ${fmtBytes(st.median)}`);
  console.log(`\nBytes by type (median): ${parts.join(', ') || 'n/a'}`);
  console.log(`LCP element: ${summary.lcpElement}`);
  console.log('\nNotes: lab numbers under applied throttling. Compare base and head under the same profile on the same machine;');
  console.log('differences smaller than the range are noise. TBT, and click latency with --click, are lab stand-ins for INP.');
  console.log('Field data (real-user monitoring, CrUX) is the final word on Core Web Vitals.');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const profile = PROFILES[args.profile];
  let base = null;
  if (args.compare) {
    try {
      base = JSON.parse(fs.readFileSync(args.compare, 'utf8')).summary;
    } catch (e) {
      fail(`Could not read ${args.compare}: ${e.message}`);
    }
  }
  const { chromium } = loadPlaywright();
  const launchOpts = {};
  const exe = args.chromium || process.env.CHROMIUM_PATH;
  if (exe) launchOpts.executablePath = exe;
  const browser = await chromium.launch(launchOpts);
  const runs = [];
  try {
    for (let i = 0; i < args.warmup; i++) await measureOnce(browser, args.url, profile, 0);
    for (let i = 0; i < args.runs; i++) {
      const r = await measureOnce(browser, args.url, profile, args.settle, args.click);
      runs.push(r);
      process.stderr.write(r.ok ? `run ${i + 1}/${args.runs}: LCP ${fmtMs(r.lcp)}, CLS ${fmtCls(r.cls)}, TBT ${fmtMs(r.tbt)}${r.click == null ? '' : `, click ${fmtClick(r.click)}`}\n` : `run ${i + 1}/${args.runs}: failed (${r.error})\n`);
    }
  } finally {
    await browser.close();
  }
  const summary = summarize(runs);
  if (!summary.okRuns) fail(`Every run failed. First error: ${runs[0] && runs[0].error}`);
  printReport(args, profile, summary, base);
  if (args.json) {
    fs.writeFileSync(args.json, JSON.stringify({ url: args.url, profile: args.profile, date: new Date().toISOString(), runs, summary }, null, 2));
    console.log(`\nSaved ${args.json}`);
  }
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
