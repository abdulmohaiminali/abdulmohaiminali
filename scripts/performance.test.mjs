import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { mountFooterSlats } from '../dist/js/footer-slats.js';
import { loadFoldersWhenNear } from '../dist/js/load-folders.js';

// A deterministic event/RAF harness exercises the real scheduling modules.
// It does not emulate browser layout, GPU rendering or visual correctness.
function harness({ reduced = false, height = 1400, width = 1024 } = {}) {
  const doc = new EventTarget(), win = new EventTarget(), motion = new EventTarget();
  Object.assign(doc, { hidden: false });
  Object.assign(win, { innerHeight: 768, devicePixelRatio: 2 });
  Object.assign(motion, { matches: reduced });
  const footer = new EventTarget();
  let reads = 0, paints = 0, bars = 0, top = 0, id = 0;
  footer.getBoundingClientRect = () => { reads++;return { top, left: 0, width, height }; };
  const ctx = { setTransform() {}, clearRect() { paints++; }, beginPath() {}, roundRect() {}, fill() { bars++; } };
  const canvas = { style: {}, closest: () => footer, getContext: () => ctx, width: 0, height: 0 };
  const queue = new Map(), observers = [], resizers = [];
  Object.assign(globalThis, {
    document: doc, window: win, matchMedia: () => motion,
    requestAnimationFrame: cb => { queue.set(++id, cb);return id; },
    cancelAnimationFrame: key => queue.delete(key),
    IntersectionObserver: class {
      constructor(cb) { this.cb = cb;observers.push(this); }
      observe() {} disconnect() { this.disconnected = true; }
    },
    ResizeObserver: class {
      constructor(cb) { this.cb = cb;resizers.push(this); }
      observe() {} disconnect() {}
    }
  });
  return {
    canvas, footer, doc, win, motion, queue, observers, resizers,
    get paints() { return paints; }, get reads() { return reads; }, get bars() { return bars; },
    setTop(value) { top = value; },
    fire(target, name, props = {}) { target.dispatchEvent(Object.assign(new Event(name), props)); },
    visible(value) { observers[0].cb([{ isIntersecting: value }]); },
    frame(now) { const pending = [...queue.values()];queue.clear();pending.forEach(cb => cb(now)); }
  };
}

test('footer sleeps offscreen/hidden, pauses on pagehide, and resumes after Back', () => {
  const h = harness();mountFooterSlats(h.canvas);
  h.resizers[0].cb();assert.equal(h.queue.size, 0);
  h.visible(true);h.frame(100);assert.equal(h.paints, 1);
  h.visible(false);assert.equal(h.queue.size, 0);
  h.doc.hidden = true;h.visible(true);h.resizers[0].cb();assert.equal(h.queue.size, 0);
  h.doc.hidden = false;h.fire(h.doc, 'visibilitychange');h.frame(200);assert.equal(h.paints, 2);
  h.fire(h.win, 'pagehide');h.resizers[0].cb();assert.equal(h.queue.size, 0);
  h.fire(h.win, 'pageshow');h.frame(300);assert.equal(h.paints, 3);
});

test('footer draws at about 30 fps on 60, 120 and 144 Hz screens', () => {
  for (const hz of [60, 120, 144]) {
    const h = harness();mountFooterSlats(h.canvas);h.visible(true);
    for (let i = 0; i < hz * 10; i++) h.frame(i * 1000 / hz);
    assert.ok(h.paints >= 298 && h.paints <= 302, `${hz} Hz: ${h.paints} frames`);
  }
});

test('footer raster stays viewport-sized even when the form textarea is very tall', () => {
  const h = harness({ height: 100000 });mountFooterSlats(h.canvas);h.visible(true);h.frame(100);
  assert.ok(h.canvas.height <= (768 + 48) * 1.25);
  assert.ok(h.bars < 2000, `Painted ${h.bars} bars`);
  const before = h.reads;
  for (let i = 0; i < 100; i++) h.fire(h.footer, 'pointermove', { clientX: 100, clientY: 100 });
  assert.equal(h.reads, before, 'pointer movement must not force layout');
  h.setTop(-4000);h.fire(h.win, 'scroll');h.frame(200);
  assert.equal(h.canvas.style.top, '3976px');
});

test('reduced motion draws one static frame and updates after scrolling', () => {
  const h = harness({ reduced: true });mountFooterSlats(h.canvas);h.visible(true);h.frame(100);
  assert.equal(h.paints, 1);assert.equal(h.queue.size, 0);
  h.fire(h.win, 'scroll');h.frame(200);assert.equal(h.paints, 2);assert.equal(h.queue.size, 0);
  h.motion.matches = false;h.fire(h.motion, 'change');h.frame(300);assert.equal(h.queue.size, 1);
  h.motion.matches = true;h.fire(h.motion, 'change');h.frame(400);assert.equal(h.queue.size, 0);
});

test('folder import waits until near view and visible, imports once, and disconnects', async () => {
  const h = harness();let calls = 0, resolve;
  loadFoldersWhenNear(h.footer, () => { calls++;return new Promise(done => { resolve = done; }); });
  assert.equal(calls, 0);
  h.doc.hidden = true;h.visible(true);assert.equal(calls, 0);
  h.doc.hidden = false;h.fire(h.doc, 'visibilitychange');assert.equal(calls, 1);
  h.visible(true);h.fire(h.footer, 'pointerenter');assert.equal(calls, 1);
  resolve();await Promise.resolve();
  assert.equal(h.observers[0].disconnected, true);
  h.fire(h.doc, 'visibilitychange');assert.equal(calls, 1);
});

test('failed folder loading can retry instead of getting stuck', async () => {
  const h = harness();let calls = 0;
  const warn = console.warn;console.warn = () => {};
  try {
    loadFoldersWhenNear(h.footer, async () => { if (++calls === 1) throw new Error('offline'); });
    h.visible(true);await Promise.resolve();
    h.fire(h.footer, 'pointerenter');await Promise.resolve();
    assert.equal(calls, 2);assert.equal(h.observers[0].disconnected, true);
  } finally { console.warn = warn; }
});

test('original folder component/style remain byte-identical', () => {
  const hashes = {
    'Folder.jsx': '8dd1cd2c49dab750b859e579b196e7016dc1ae47b9d97ff50240e9fb650ad2c9',
    'Folder.css': '74a8f213ad51cb946ffa66c48b9c157ad96f9e6e8a8ae78dc9b0056576fc44d6'
  };
  for (const [file, hash] of Object.entries(hashes)) {
    assert.equal(createHash('sha256').update(fs.readFileSync(new URL(`../src/${file}`, import.meta.url))).digest('hex'), hash);
  }
});

test('actual lanyard solver stays finite through intro, flip, drag/release at 30 and 60 fps', async () => {
  // Expose private solver helpers in a test-only module; do not change production exports.
  let source = fs.readFileSync(new URL('../src/lanyard.js', import.meta.url), 'utf8');
  source = source.replace("'./vendor/three.module.min.js'", JSON.stringify(new URL('../src/vendor/three.module.min.js', import.meta.url).href));
  source += '\nexport { createSimulation, configureSimulation, placeHanging, stepSimulation, cardLayout };';
  const api = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  const physics = { gravity:40, hold:154, stiffness:1600, spring:40, bandDamping:30.4,
    linearDrag:1, angularDrag:Math.sqrt(12)*.5, air:.15, broadside:.5, spinAir:.03,
    nodeDrag:2, nodeAir:.2, twist:30, twistDamping:3, grip:40, gripDamping:6, breeze:.5 };
  for (const fps of [30, 60]) {
    const sim = api.createSimulation(), layout = api.cardLayout('portrait', .3);
    sim.anchor.set(0, 2, 0);api.configureSimulation(sim, layout, 1);api.placeHanging(sim, layout, true);
    for (let i = 0; i < fps * 20; i++) {
      if (i === fps * 3) { sim.turn = Math.PI;sim.body.angular.y += 9; }
      if (i === fps * 6) sim.grab = { local: sim.anchor.clone().set(0, 0, 0), rotation: sim.body.quaternion.clone(), from: sim.body.position.clone(), target: sim.body.position.clone().addScalar(.2) };
      if (i === fps * 8) sim.grab = null;
      api.stepSimulation(sim, 1/fps, physics, i/fps);
      assert.ok([...sim.body.position.toArray(), ...sim.body.quaternion.toArray(), ...sim.lengths].every(Number.isFinite));
      assert.ok(sim.body.position.length() < 100, 'simulation escaped its bounds');
    }
  }
});
