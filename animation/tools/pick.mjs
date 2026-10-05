// usage: node tools/pick.mjs <t> <x> <y>  -> lists 3D objects under that pixel
import { chromium } from 'playwright';
import { startServer } from '../server.mjs';
const [t, x, y] = process.argv.slice(2).map(Number);
const { port, close } = await startServer(0);
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(`http://127.0.0.1:${port}/index.html?render`);
await p.waitForFunction(() => window.ready); await p.evaluate(() => window.ready);
await p.addScriptTag({ type: 'module', content: `
  import * as W from '/src/world.js';
  window.__pick = (x, y) => { const r = new W.THREE.Raycaster(); r.setFromCamera({ x: x / 960 - 1, y: 1 - y / 540 }, W.camera);
    r.params.Line.threshold = 0.001; return r.intersectObjects(W.scene.children, true).filter(h => h.object.type !== 'LineSegments').slice(0, 6).map(h => (h.object.type + ' ' + h.object.geometry?.type + ' d=' + h.distance.toFixed(2) + ' pos=' + h.object.getWorldPosition(new W.THREE.Vector3()).toArray().map(v=>v.toFixed(2)).join(','))); };` });
await p.waitForFunction(() => window.__pick);
await p.evaluate((tt) => window.seek(tt), t);
console.log(await p.evaluate(([a, c]) => window.__pick(a, c), [x, y]));
await b.close(); close();
