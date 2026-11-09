// Title-screen touch regression.
// Run: sh tests/title-controls.sh
const assert = require("assert");
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");
const path = require("path");

const MERCH = "https://petinplumbco.myshopify.com/?utm_source=trapfull&utm_medium=web&utm_campaign=pepperrun";
const PEPPER = "https://jimmdunc-hub.github.io/pepper-run/?utm_source=trapfull&utm_medium=web&utm_campaign=bonus";
const EP04 = "2026-11-06T08:00-06:00";
const EP05 = "2026-11-11T08:00-06:00";
const shotDir = process.env.SHOT_DIR || "/tmp/trap-shots";
fs.mkdirSync(shotDir, { recursive: true });

const tests = [];
function test(name, fn, ms) { tests.push({ name, fn, ms: ms || 60000 }); }

let aborted = [];

function same(actual, expected, label) {
  assert.deepStrictEqual(actual, expected, (label || "expected") + " " + JSON.stringify(actual));
}
function localOnly() {
  const leaked = aborted.filter((u) => u.indexOf("gc.zgo.at") < 0 && u.indexOf("goatcounter.com") < 0);
  same(leaked, [], "request left the local origin");
}
async function shot(page, name) {
  await page.screenshot({ path: path.join(shotDir, name + ".png") });
}
async function openTitle(page) {
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const tip = document.getElementById("codeTip");
    return !!(tip && tip.textContent.indexOf("Weekly code tip") >= 0 && window.__TRAP && window.__TRAP.episodes.ep04);
  });
  await page.evaluate(() => {
    const ov = document.getElementById("overlay");
    window.__touchLog = [];
    const note = (phase, e) => window.__touchLog.push({
      phase: phase, id: e.target && e.target.id, tag: e.target && e.target.tagName, prevented: e.defaultPrevented,
    });
    ov.addEventListener("touchstart", (e) => note("touchstart", e), true);
    ov.addEventListener("touchend", (e) => note("touchend", e));
    ov.addEventListener("click", (e) => note("click", e), true);
  });
}
async function read(page) {
  return page.evaluate(() => ({
    url: location.href,
    titleHidden: document.getElementById("overlay").classList.contains("is-hidden"),
    selectHidden: document.getElementById("select").classList.contains("is-hidden"),
    appHidden: document.getElementById("app").classList.contains("is-hidden"),
    events: window.__trapEvents.slice(),
    intents: window.__hrefIntents.slice(),
    touch: (window.__touchLog || []).slice(),
    scene: window.__TRAP.state && window.__TRAP.state.scene,
    ep: window.__TRAP.state && window.__TRAP.state.ep,
    mute: document.querySelector("#overlay .muteBtn").textContent,
  }));
}
function plays(snap) { return snap.events.filter((e) => e.name === "play"); }
async function weekNow(page) {
  return page.evaluate(() => {
    const now = Date.now();
    const rows = (window.EPISODES_INDEX || []).filter((e) => {
      const ep = window.__TRAP.episodes[e.id];
      return ep && !e.stub && !ep.stub;
    });
    const open = rows.filter((e) => {
      const rel = e.release || "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(rel)) {
        const d = new Date();
        const today = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
        return rel <= today;
      }
      const at = Date.parse(rel);
      return isFinite(at) && now >= at;
    }).sort((a, b) => b.week - a.week);
    const top = open[0];
    const ep = window.__TRAP.episodes[top.id];
    return { id: top.id, week: ep.week, title: ep.title, scene: ep.start.scene };
  });
}

test("release gates stay November 6 and November 11", async (page) => {
  await openTitle(page);
  const gates = await page.evaluate(() => ({
    index4: window.EPISODES_INDEX.find((e) => e.id === "ep04").release,
    index5: window.EPISODES_INDEX.find((e) => e.id === "ep05").release,
    ep4: window.__TRAP.episodes.ep04.release,
    ep5: window.__TRAP.episodes.ep05.release,
  }));
  same(gates, { index4: EP04, index5: EP05, ep4: EP04, ep5: EP05 }, "release");
  const week = await weekNow(page);
  await page.locator("#btnSelect").tap();
  assert.equal(await page.locator("#select").isVisible(), true);
  const grid = await page.locator("#epGrid").innerText();
  if (Date.now() < Date.parse(EP05)) assert.equal(grid.indexOf("Hold, Please") < 0, true, grid);
  if (Date.now() >= Date.parse(EP04)) assert.equal(grid.indexOf("No Hot Water") >= 0, true, grid);
  assert.equal(grid.indexOf("Framework Stub") < 0, true);
  assert.equal(["ep05", "ep04", "ep03"].indexOf(week.id) >= 0, true, week.id);
  same(plays(await read(page)), [], "play");
  localOnly();
});

test("touch Merch follows the store link and does not start the week", async (page) => {
  await openTitle(page);
  assert.equal(await page.getAttribute("#btnMerchTitle", "href"), MERCH);
  assert.equal(await page.getAttribute("#btnMerchTitle", "target"), "_blank");
  await shot(page, "touch-merch-before");
  await page.locator("#btnMerchTitle").tap();
  await page.waitForTimeout(150);
  await shot(page, "touch-merch-after");
  const snap = await read(page);
  assert.equal(snap.titleHidden, false, JSON.stringify(snap));
  same(plays(snap), [], "play");
  same(snap.intents.map((i) => i.href), [MERCH], "href");
  assert.equal(snap.intents[0].target, "_blank");
  assert.equal(snap.touch.some((t) => t.phase === "touchend" && t.id === "btnMerchTitle" && t.prevented), false, JSON.stringify(snap.touch));
  assert.equal(snap.touch.some((t) => t.phase === "click" && t.id === "btnMerchTitle"), true, JSON.stringify(snap.touch));
  same(snap.events, [{ name: "merch", id: "title" }], "events");
  assert.equal(new URL(snap.url).host, "127.0.0.1:4173");
  localOnly();
});

test("touch Pepper Run follows its link and does not start the week", async (page) => {
  await openTitle(page);
  assert.equal(await page.getAttribute("#btnPepper", "href"), PEPPER);
  await shot(page, "touch-pepper-before");
  await page.locator("#btnPepper").tap();
  await page.waitForTimeout(150);
  await shot(page, "touch-pepper-after");
  const snap = await read(page);
  assert.equal(snap.titleHidden, false, JSON.stringify(snap));
  same(plays(snap), [], "play");
  same(snap.intents.map((i) => i.href), [PEPPER], "href");
  assert.equal(snap.touch.some((t) => t.phase === "touchend" && t.id === "btnPepper" && t.prevented), false, JSON.stringify(snap.touch));
  assert.equal(snap.touch.some((t) => t.phase === "click" && t.id === "btnPepper"), true, JSON.stringify(snap.touch));
  same(snap.events, [], "events");
  assert.equal(new URL(snap.url).pathname, "/");
  localOnly();
});

test("touch This week's call starts the released week once", async (page) => {
  await openTitle(page);
  const week = await weekNow(page);
  await page.locator("#btnWeek").tap();
  await page.waitForTimeout(150);
  await page.locator("#btnWeek").tap({ force: true, timeout: 1000 }).catch(() => {});
  const snap = await read(page);
  assert.equal(snap.titleHidden, true);
  assert.equal(snap.appHidden, false);
  same(plays(snap), [{ name: "play", id: week.id }], "play");
  assert.equal(snap.scene, week.scene);
  assert.equal(snap.ep, week.id);
  await shot(page, "touch-week");
  localOnly();
});

test("touch title background starts the released week once", async (page) => {
  await openTitle(page);
  const week = await weekNow(page);
  await page.locator("#logo").tap();
  await page.waitForTimeout(150);
  await page.keyboard.press("Enter");
  const snap = await read(page);
  same(plays(snap), [{ name: "play", id: week.id }], "play");
  assert.equal(snap.scene, week.scene);
  assert.equal(snap.titleHidden, true);
  await shot(page, "touch-background");
  localOnly();
});

test("touch episode select and mute do not start the week", async (page) => {
  await openTitle(page);
  await page.locator("#btnSelect").tap();
  let snap = await read(page);
  assert.equal(snap.selectHidden, false);
  assert.equal(snap.titleHidden, true);
  same(plays(snap), [], "play");
  await page.locator("#selBack").tap();
  assert.equal(await page.locator("#overlay").isVisible(), true);
  const mute = page.locator("#overlay .muteBtn");
  const before = await mute.textContent();
  await mute.tap();
  snap = await read(page);
  assert.equal(snap.titleHidden, false);
  same(plays(snap), [], "play");
  assert.notEqual(snap.mute, before);
  await shot(page, "touch-mute");
  localOnly();
});

test("mouse clicks on Merch and Pepper Run follow the links", async (page) => {
  await openTitle(page);
  await page.locator("#btnMerchTitle").click();
  let snap = await read(page);
  assert.equal(snap.titleHidden, false, JSON.stringify(snap));
  same(plays(snap), [], "play");
  same(snap.intents.map((i) => i.href), [MERCH], "href");
  await page.locator("#btnPepper").click();
  snap = await read(page);
  assert.equal(snap.titleHidden, false);
  same(plays(snap), [], "play");
  same(snap.intents.map((i) => i.href), [MERCH, PEPPER], "href");
  assert.equal(new URL(snap.url).pathname, "/");
  localOnly();
});

test("mouse click on the title background starts the week once", async (page) => {
  await openTitle(page);
  const week = await weekNow(page);
  await page.locator("#tapHint").click();
  await page.waitForTimeout(100);
  const snap = await read(page);
  same(plays(snap), [{ name: "play", id: week.id }], "play");
  assert.equal(snap.scene, week.scene);
  localOnly();
});

test("keyboard Enter on Merch follows the store link", async (page) => {
  await openTitle(page);
  await page.locator("#btnMerchTitle").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  const snap = await read(page);
  assert.equal(snap.titleHidden, false, JSON.stringify(snap));
  same(plays(snap), [], "play");
  same(snap.intents.map((i) => i.href), [MERCH], "href");
  assert.equal(new URL(snap.url).pathname, "/");
  localOnly();
});

test("keyboard Enter on Pepper Run follows its link", async (page) => {
  await openTitle(page);
  await page.locator("#btnPepper").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  const snap = await read(page);
  assert.equal(snap.titleHidden, false, JSON.stringify(snap));
  same(plays(snap), [], "play");
  same(snap.intents.map((i) => i.href), [PEPPER], "href");
  localOnly();
});

test("keyboard Space on Merch does not start the week", async (page) => {
  await openTitle(page);
  await page.locator("#btnMerchTitle").focus();
  await page.keyboard.press(" ");
  await page.waitForTimeout(100);
  const snap = await read(page);
  assert.equal(snap.titleHidden, false, JSON.stringify(snap));
  same(plays(snap), [], "play");
  localOnly();
});

test("keyboard activates week, select, mute, and a bare Enter once each", async (page) => {
  await openTitle(page);
  await page.locator("#btnSelect").focus();
  await page.keyboard.press("Enter");
  let snap = await read(page);
  assert.equal(snap.selectHidden, false);
  same(plays(snap), [], "play");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#overlay").isVisible(), true);

  const mute = page.locator("#overlay .muteBtn");
  const before = await mute.textContent();
  await mute.focus();
  await page.keyboard.press("Enter");
  snap = await read(page);
  assert.equal(snap.titleHidden, false);
  assert.notEqual(snap.mute, before);
  same(plays(snap), [], "play");

  await page.evaluate(() => { const ae = document.activeElement; if (ae && ae !== document.body && ae.blur) ae.blur(); });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  const week = await weekNow(page);
  snap = await read(page);
  same(plays(snap), [{ name: "play", id: week.id }], "play");

  await openTitle(page);
  const again = await weekNow(page);
  await page.locator("#btnWeek").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  await page.keyboard.press("Enter");
  snap = await read(page);
  same(plays(snap), [{ name: "play", id: again.id }], "play");
  assert.equal(snap.scene, again.scene);
  localOnly();
});

test("v2 save migrates on this origin and the v2 keys stay", async (page) => {
  const v2 = JSON.stringify({
    scene: "s01", P: 20, R: 55, T: 60, flags: {}, history: [], correct: 3, total: 4,
    dalehacks: 1, elapsedMs: 1500, penaltyMs: 0, rngState: 12345, seed: "V2SEED",
    tipsWrong: [], tipsRight: [], hackTips: [], seenTips: [], panel: null,
  });
  const endings = JSON.stringify(["endNote"]);
  await page.addInitScript(({ v2, endings }) => {
    localStorage.setItem("trapfull.v2", v2);
    localStorage.setItem("trapfull.v2.endings", endings);
    localStorage.setItem("trapfull.v2.mute", "1");
  }, { v2, endings });
  await openTitle(page);
  const saved = await page.evaluate(() => {
    const run = JSON.parse(localStorage.getItem("trapfull.v3.ep00.run"));
    const meta = JSON.parse(localStorage.getItem("trapfull.v3.meta"));
    return {
      keys: Object.keys(localStorage),
      v2: localStorage.getItem("trapfull.v2"),
      v2end: localStorage.getItem("trapfull.v2.endings"),
      v2mute: localStorage.getItem("trapfull.v2.mute"),
      run: run && { ep: run.ep, scene: run.scene, P: run.P, R: run.R, T: run.T, correct: run.correct, total: run.total, dalehacks: run.dalehacks, elapsedMs: run.elapsedMs },
      endings: localStorage.getItem("trapfull.v3.ep00.endings"),
      meta: meta && { schema: meta.schema, muted: meta.muted, migratedFromV2: meta.migratedFromV2, played: meta.played },
    };
  });
  assert.equal(saved.v2, v2);
  assert.equal(saved.v2end, endings);
  assert.equal(saved.v2mute, "1");
  same(saved.run, { ep: "ep00", scene: "s01", P: 20, R: 55, T: 60, correct: 3, total: 4, dalehacks: 1, elapsedMs: 1500 }, "run");
  assert.equal(saved.endings, endings);
  same(saved.meta, { schema: 1, muted: true, migratedFromV2: true, played: { ep00: true } }, "meta");
  assert.equal(saved.keys.some((k) => /https?:|github|vercel|shopify/i.test(k)), false, saved.keys.join(","));
  same(saved.keys.filter((k) => k.indexOf("trapfull.v2") === 0).sort(), ["trapfull.v2", "trapfull.v2.endings", "trapfull.v2.mute"], "v2 keys");
  localOnly();
});

test("existing v3 save is not overwritten by v2", async (page) => {
  const meta = JSON.stringify({ schema: 1, lastEpisode: "ep01", muted: false, played: { ep01: true } });
  const run = JSON.stringify({ schema: 1, ep: "ep00", scene: "s01", marker: "keep-v3" });
  const v2 = JSON.stringify({ scene: "s08", P: 1, R: 1, T: 1, seed: "OLDOLD" });
  await page.addInitScript(({ meta, run, v2 }) => {
    localStorage.setItem("trapfull.v3.meta", meta);
    localStorage.setItem("trapfull.v3.ep00.run", run);
    localStorage.setItem("trapfull.v2", v2);
  }, { meta, run, v2 });
  await openTitle(page);
  const saved = await page.evaluate(() => ({
    meta: localStorage.getItem("trapfull.v3.meta"),
    run: localStorage.getItem("trapfull.v3.ep00.run"),
    v2: localStorage.getItem("trapfull.v2"),
  }));
  assert.equal(saved.meta, meta);
  assert.equal(saved.run, run);
  assert.equal(saved.v2, v2);
  localOnly();
});

test("play the released week through one ending", async (page) => {
  await page.addInitScript(() => localStorage.setItem("trapfull.ui3.timer", "off"));
  await openTitle(page);
  const week = await weekNow(page);
  await shot(page, "play-title");
  await page.locator("#btnWeek").tap();
  await page.waitForFunction((id) => window.__TRAP.state && window.__TRAP.state.ep === id, week.id);
  await shot(page, "play-week");
  let ending = null;
  for (let i = 0; i < 40 && !ending; i++) {
    ending = await page.evaluate(() => {
      const st = window.__TRAP.state;
      const ep = st && window.__TRAP.episodes[st.ep];
      return st && ep && ep.endings && ep.endings[st.scene] ? { id: st.scene, tag: ep.endings[st.scene].tag, ep: st.ep } : null;
    });
    if (ending) break;
    const scene = await page.evaluate(() => window.__TRAP.state && window.__TRAP.state.scene);
    if (await page.locator("#pepperRun .pr-skip").count()) await page.locator("#pepperRun .pr-skip").click();
    else if (await page.locator("#panelContinue").count()) await page.locator("#panelContinue").click();
    else await page.locator("#choices button.choice:not(.locked)").first().click();
    try {
      await page.waitForFunction((prev) => {
        const st = window.__TRAP.state;
        const ep = st && window.__TRAP.episodes[st.ep];
        const ended = !!(st && ep && ep.endings && ep.endings[st.scene]);
        return ended || (st && st.scene !== prev) || document.getElementById("pepperRun");
      }, scene, { timeout: 8000 });
    } catch (err) {
      throw new Error("stuck at " + scene + " step " + i);
    }
  }
  assert.ok(ending, "reached an ending");
  assert.equal(await page.locator("#text h2").innerText(), ending.tag);
  const snap = await read(page);
  same(plays(snap), [{ name: "play", id: week.id }], "play");
  assert.equal(snap.events.some((e) => e.name === "ending" && e.id.indexOf(week.id + "/") === 0), true, JSON.stringify(snap.events));
  await shot(page, "play-ending");
  localOnly();
}, 180000);

test("built-in verify passes for ep00 through ep05", async (page) => {
  const ids = ["ep00", "ep01", "ep02", "ep03", "ep04", "ep05"];
  const results = [];
  for (const id of ids) {
    await page.goto("http://127.0.0.1:4173/?verify=1&ep=" + id, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.__TRAP_FULL_VERIFY__, null, { timeout: 90000 });
    const result = await page.evaluate(() => window.__TRAP_FULL_VERIFY__);
    results.push({ ep: result.ep, ok: result.ok });
    assert.equal(result.ok, true, JSON.stringify({
      ep: result.ep, missing: result.missing, unreachable: result.unreachable, routeMiss: result.routeMiss,
      tipKeysMissing: result.tipKeysMissing, licensedFails: result.licensedFails, gasRepairChoices: result.gasRepairChoices,
      brandHits: result.brandHits, realPlay: result.realPlay,
    }));
  }
  same(results, ids.map((ep) => ({ ep, ok: true })), "verify");
  localOnly();
}, 300000);

function serverUp() {
  return new Promise((resolve) => {
    const req = http.get("http://127.0.0.1:4173/", (res) => { res.resume(); resolve(res.statusCode === 200); });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  if (!(await serverUp())) {
    const child = spawn("python3", ["-m", "http.server", "4173", "--bind", "127.0.0.1"], {
      cwd: path.join(__dirname, ".."), stdio: "ignore", detached: true,
    });
    child.unref();
    for (let i = 0; i < 50 && !(await serverUp()); i++) await new Promise((r) => setTimeout(r, 100));
  }
  const filter = process.env.FILTER || "";
  const selected = tests.filter((t) => !filter || t.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  const browser = await chromium.launch({ headless: true });
  let failed = 0;
  for (const t of selected) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1,
    });
    aborted = [];
    await context.route("**/*", (route) => {
      const url = route.request().url();
      const host = new URL(url).hostname;
      if (host === "127.0.0.1" || host === "localhost") return route.continue();
      aborted.push(url);
      return route.abort();
    });
    await context.addInitScript(() => {
      window.__hrefIntents = [];
      window.addEventListener("click", (e) => {
        const a = e.target && e.target.closest && e.target.closest("a[href]");
        if (!a) return;
        window.__hrefIntents.push({ id: a.id, href: a.getAttribute("href"), abs: a.href, target: a.target });
        e.preventDefault();
      }, true);
    });
    const page = await context.newPage();
    page.on("popup", (popup) => aborted.push("popup:" + popup.url()));
    const started = Date.now();
    let timer;
    try {
      await Promise.race([
        t.fn(page),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("timeout " + t.ms + "ms")), t.ms); }),
      ]);
      console.log("ok   " + t.name + "  " + (Date.now() - started) + "ms");
    } catch (err) {
      failed++;
      console.log("FAIL " + t.name);
      console.log(err && err.stack ? err.stack : err);
    } finally {
      clearTimeout(timer);
    }
    await context.close();
  }
  await browser.close();
  console.log((selected.length - failed) + " passed, " + failed + " failed, " + selected.length + " total");
  process.exit(failed ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
