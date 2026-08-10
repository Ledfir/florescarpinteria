import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';

const easings = {
  easeOutBack: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutBounce: (t) => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  linear: (t) => t,
};
const lerp = (a, b, t) => a + (b - a) * t;

function makeTask(target, from, to, startMs, durMs, easingName, onComplete) {
  const easing = easings[easingName] || easings.easeOutBack;
  let fired = false;
  return {
    update(nowMs) {
      if (nowMs < startMs) return;
      const t = Math.min(1, (nowMs - startMs) / durMs);
      const e = easing(t);
      Object.keys(to).forEach((k) => { target[k] = lerp(from[k], to[k], e); });
      if (t >= 1 && !fired) { fired = true; onComplete && onComplete(); }
    },
  };
}

const COLORS = { blueLine: 0x6e94bf, bg: 0x16283d };

function makeWoodTexture(base, grainDark, grainLight) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 26; i++) {
    const y = (i / 26) * 256 + (Math.random() * 6 - 3);
    ctx.strokeStyle = Math.random() > 0.5 ? grainDark : grainLight;
    ctx.globalAlpha = 0.12 + Math.random() * 0.18;
    ctx.lineWidth = 0.6 + Math.random() * 1.6;
    ctx.beginPath(); ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 16) ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * (3 + Math.random() * 3));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function woodMaterial(tex) {
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.03, transparent: true, opacity: 0 });
}
function metalMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0xf5f3ee, metalness: 0.1, roughness: 0.45, transparent: true, opacity: 0 });
}

function makeLabelSprite(text) {
  const c = document.createElement('canvas');
  c.width = 320; c.height = 100;
  const ctx = c.getContext('2d');
  ctx.font = '600 44px ui-monospace, "Courier New", monospace';
  ctx.fillStyle = '#EAF2FA'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 160, 52);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, opacity: 0 });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.1, 0.66, 1);
  return sprite;
}
function makeDimLine(p1, p2, tickDir, label, labelPos) {
  const g = new THREE.Group();
  const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...p1), new THREE.Vector3(...p2)]);
  g.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: COLORS.blueLine, transparent: true, opacity: 0 })));
  const tLen = 0.2;
  [p1, p2].forEach((p) => {
    const a = new THREE.Vector3(p[0] - tickDir[0] * tLen, p[1] - tickDir[1] * tLen, p[2] - tickDir[2] * tLen);
    const b = new THREE.Vector3(p[0] + tickDir[0] * tLen, p[1] + tickDir[1] * tLen, p[2] + tickDir[2] * tLen);
    const tgeo = new THREE.BufferGeometry().setFromPoints([a, b]);
    g.add(new THREE.Line(tgeo, new THREE.LineBasicMaterial({ color: COLORS.blueLine, transparent: true, opacity: 0 })));
  });
  const sprite = makeLabelSprite(label);
  sprite.position.set(...labelPos);
  g.add(sprite);
  return g;
}
function buildDimsGroup() {
  const g = new THREE.Group();
  g.add(makeDimLine([-6, 18.7, 0], [6, 18.7, 0], [0, 1, 0], '120 cm', [0, 19.5, 0]));
  g.add(makeDimLine([-6.9, 0, 0], [-6.9, 18, 0], [1, 0, 0], '180 cm', [-7.9, 9, 0]));
  g.add(makeDimLine([6.9, 18, -2.5], [6.9, 18, 2.5], [0, 1, 0], '50 cm', [7.9, 18, 0]));
  g.add(makeDimLine([-5.85, -1.0, 0], [1.91, -1.0, 0], [0, 1, 0], '77.6 cm', [-1.97, -1.7, 0]));
  g.add(makeDimLine([2.06, -1.0, 0], [5.85, -1.0, 0], [0, 1, 0], '37.6 cm', [3.955, -1.7, 0]));
  g.add(makeDimLine([-6, 0.15, 2.5], [-7.4, -1.2, 2.5], [1, 0, 0], 'Espesor 1.5 cm', [-8, -1.6, 2.5]));
  return g;
}
function setGroupOpacity(g, o) { g.traverse((obj) => { if (obj.material) obj.material.opacity = o; }); }

function buildPartDefs() {
  const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const rod = (r, len) => new THREE.CylinderGeometry(r, r, len, 16);
  return [
    { name: 'Lateral izquierdo', geo: box(0.15, 18, 5), mat: 'wood',
      target: { p: [-5.925, 9, 0], r: [0, 0, 0] }, start: { p: [-9, 2, 4], r: [0, 0, 1.5708] }, t0: 0, dur: 950, easing: 'easeOutBack' },
    { name: 'Lateral derecho', geo: box(0.15, 18, 5), mat: 'wood',
      target: { p: [5.925, 9, 0], r: [0, 0, 0] }, start: { p: [9, 2.2, 4.2], r: [0, 0, -1.5708] }, t0: 180, dur: 950, easing: 'easeOutBack' },
    { name: 'Panel inferior', geo: box(12, 0.15, 5), mat: 'wood',
      target: { p: [0, 0.075, 0], r: [0, 0, 0] }, start: { p: [0, 20, -6], r: [0.3, 0, 0] }, t0: 1000, dur: 950, easing: 'easeOutBounce' },
    { name: 'Panel superior', geo: box(12, 0.15, 5), mat: 'wood',
      target: { p: [0, 17.925, 0], r: [0, 0, 0] }, start: { p: [0, 23, -6.4], r: [0.3, 0, 0] }, t0: 1750, dur: 950, easing: 'easeOutBounce' },
    { name: 'Divisor central', geo: box(0.15, 17.7, 5), mat: 'wood',
      target: { p: [1.985, 9, 0], r: [0, 0, 0] }, start: { p: [1.985, 20, 0.6], r: [0.25, 0, 0] }, t0: 2600, dur: 950, easing: 'easeOutBounce' },
    { name: 'Repisa media (colgado)', geo: box(7.76, 0.15, 5), mat: 'wood',
      target: { p: [-1.97, 9, 0], r: [0, 0, 0] }, start: { p: [-1.97, 9, 6.5], r: [0, 0.35, 0] }, t0: 3400, dur: 850, easing: 'easeOutBack' },
    { name: 'Barra colgador superior', geo: rod(0.09, 7.46), mat: 'metal',
      target: { p: [-1.97, 16.05, 0], r: [0, 0, 1.5708] }, start: { p: [-1.97, 16.05, 6.5], r: [0, 0, 1.5708] }, t0: 4150, dur: 700, easing: 'easeOutElastic' },
    { name: 'Barra colgador inferior', geo: rod(0.09, 7.46), mat: 'metal',
      target: { p: [-1.97, 7.125, 0], r: [0, 0, 1.5708] }, start: { p: [-1.97, 7.125, 6.5], r: [0, 0, 1.5708] }, t0: 4350, dur: 700, easing: 'easeOutElastic' },
    { name: 'Entrepaño fijo (1)', geo: box(3.79, 0.15, 5), mat: 'wood',
      target: { p: [3.955, 12.775, 0], r: [0, 0, 0] }, start: { p: [3.955, 12.775, 6.5], r: [0, -0.3, 0] }, t0: 5000, dur: 650, easing: 'easeOutBack' },
    { name: 'Entrepaño fijo (2)', geo: box(3.79, 0.15, 5), mat: 'wood',
      target: { p: [3.955, 10.658, 0], r: [0, 0, 0] }, start: { p: [3.955, 10.658, 6.5], r: [0, -0.3, 0] }, t0: 5250, dur: 650, easing: 'easeOutBack' },
    { name: 'Entrepaño fijo (3)', geo: box(3.79, 0.15, 5), mat: 'wood',
      target: { p: [3.955, 8.541, 0], r: [0, 0, 0] }, start: { p: [3.955, 8.541, 6.5], r: [0, -0.3, 0] }, t0: 5500, dur: 650, easing: 'easeOutBack' },
    { name: 'Entrepaño fijo (4)', geo: box(3.79, 0.15, 5), mat: 'wood',
      target: { p: [3.955, 6.424, 0], r: [0, 0, 0] }, start: { p: [3.955, 6.424, 6.5], r: [0, -0.3, 0] }, t0: 5750, dur: 650, easing: 'easeOutBack' },
    { name: 'Entrepaño fijo (5)', geo: box(3.79, 0.15, 5), mat: 'wood',
      target: { p: [3.955, 4.307, 0], r: [0, 0, 0] }, start: { p: [3.955, 4.307, 6.5], r: [0, -0.3, 0] }, t0: 6000, dur: 650, easing: 'easeOutBack' },
    { name: 'Entrepaño fijo (6)', geo: box(3.79, 0.15, 5), mat: 'wood',
      target: { p: [3.955, 2.19, 0], r: [0, 0, 0] }, start: { p: [3.955, 2.19, 6.5], r: [0, -0.3, 0] }, t0: 6250, dur: 650, easing: 'easeOutBack' },
  ];
}

export default function ClosetOrganizer() {
  const hostRef = useRef(null);
  const resetRef = useRef(() => {});
  const toggleDimsRef = useRef(() => {});
  const [progress, setProgress] = useState(0);
  const [partNames, setPartNames] = useState([]);
  const [doneFlags, setDoneFlags] = useState([]);
  const [dimsVisible, setDimsVisible] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let frameId;
    let dragging = false, lastX = 0, lastY = 0;
    let camAngle = 0.5, camElev = 0.22;
    const camDist = 42;
    const camTarget = new THREE.Vector3(0, 9, 0);
    let idleAngle = 0;
    let clockStart = performance.now();
    let tasks = [];

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.bg);
    scene.fog = new THREE.Fog(COLORS.bg, 32, 62);

    const camera = new THREE.PerspectiveCamera(30, host.clientWidth / host.clientHeight, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    function updateCamera() {
      camera.position.set(
        camTarget.x + camDist * Math.sin(camAngle) * Math.cos(camElev),
        camTarget.y + camDist * Math.sin(camElev),
        camTarget.z + camDist * Math.cos(camAngle) * Math.cos(camElev)
      );
      camera.lookAt(camTarget);
    }
    updateCamera();

    scene.add(new THREE.AmbientLight(0xbdd0e6, 0.6));
    const key = new THREE.DirectionalLight(0xfff2df, 1.1);
    key.position.set(12, 18, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fillLight = new THREE.DirectionalLight(0x6e94bf, 0.35);
    fillLight.position.set(-10, 8, -10);
    scene.add(fillLight);

    const grid = new THREE.GridHelper(40, 40, COLORS.blueLine, COLORS.blueLine);
    grid.material.opacity = 0.14;
    grid.material.transparent = true;
    scene.add(grid);

    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.26 }));
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const woodTex = makeWoodTexture('#7A4B2A', '#4A2C16', '#9C6B42');
    const partDefs = buildPartDefs();
    setPartNames(partDefs.map((d) => d.name));
    setDoneFlags(partDefs.map(() => false));

    const group = new THREE.Group();
    scene.add(group);

    const dimsGroup = buildDimsGroup();
    scene.add(dimsGroup);
    setGroupOpacity(dimsGroup, 0);
    let dimsOn = false;
    const dimsFadeState = { value: 0 };

    const meshes = [];
    const ghosts = [];

    partDefs.forEach((def) => {
      const ghost = new THREE.LineSegments(
        new THREE.EdgesGeometry(def.geo),
        new THREE.LineBasicMaterial({ color: COLORS.blueLine, transparent: true, opacity: 0.85 })
      );
      ghost.position.set(...def.target.p);
      ghost.rotation.set(...def.target.r);
      group.add(ghost);
      ghosts.push(ghost);

      const mesh = new THREE.Mesh(def.geo, def.mat === 'metal' ? metalMaterial() : woodMaterial(woodTex));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(...def.start.p);
      mesh.rotation.set(...def.start.r);
      group.add(mesh);
      meshes.push(mesh);
    });

    function spawnDust(pos) {
      for (let i = 0; i < 5; i++) {
        const g = new THREE.TetrahedronGeometry(0.06 + Math.random() * 0.04);
        const m = new THREE.MeshBasicMaterial({ color: 0xeaf2fa, transparent: true, opacity: 0.55 });
        const p = new THREE.Mesh(g, m);
        p.position.set(pos[0], pos[1], pos[2]);
        scene.add(p);
        const dir = { x: (Math.random() - 0.5) * 1.2, y: Math.random() * 0.8 + 0.2, z: (Math.random() - 0.5) * 1.2 };
        const dustStart = performance.now() - clockStart;
        tasks.push(makeTask(p.position,
          { x: p.position.x, y: p.position.y, z: p.position.z },
          { x: pos[0] + dir.x, y: pos[1] + dir.y, z: pos[2] + dir.z },
          dustStart, 550, 'linear'));
        tasks.push(makeTask(m, { opacity: 0.55 }, { opacity: 0 }, dustStart, 550, 'linear', () => {
          scene.remove(p); g.dispose(); m.dispose();
        }));
      }
    }

    function buildTasks() {
      tasks = [];
      let doneCount = 0;
      setDoneFlags(partDefs.map(() => false));
      setProgress(0);

      partDefs.forEach((def, i) => {
        const mesh = meshes[i], ghost = ghosts[i], dur = def.dur, easing = def.easing;
        tasks.push(makeTask(mesh.position,
          { x: def.start.p[0], y: def.start.p[1], z: def.start.p[2] },
          { x: def.target.p[0], y: def.target.p[1], z: def.target.p[2] },
          def.t0, dur, easing));
        tasks.push(makeTask(mesh.rotation,
          { x: def.start.r[0], y: def.start.r[1], z: def.start.r[2] },
          { x: def.target.r[0], y: def.target.r[1], z: def.target.r[2] },
          def.t0, dur, easing));
        tasks.push(makeTask(mesh.material, { opacity: 0 }, { opacity: 1 }, def.t0, dur * 0.5, 'linear'));
        tasks.push(makeTask(ghost.material, { opacity: 0.85 }, { opacity: 0 },
          def.t0 + dur * 0.35, dur * 0.6, 'linear', () => {
            spawnDust(def.target.p);
            doneCount++;
            setProgress(doneCount);
            setDoneFlags((prev) => prev.map((v, idx) => (idx === i ? true : v)));
          }));
      });

      const lastEnd = Math.max(...partDefs.map((d) => d.t0 + d.dur)) + 150;
      tasks.push(makeTask(group.scale, { x: 1, y: 1, z: 1 }, { x: 1.02, y: 1.02, z: 1.02 }, lastEnd, 220, 'easeOutElastic'));
      tasks.push(makeTask(group.scale, { x: 1.02, y: 1.02, z: 1.02 }, { x: 1, y: 1, z: 1 }, lastEnd + 220, 200, 'easeOutBack'));
      tasks.push(makeTask(dimsFadeState, { value: 0 }, { value: 1 }, lastEnd + 350, 550, 'linear', () => {
        dimsOn = true;
        setDimsVisible(true);
      }));
    }

    function resetScene() {
      partDefs.forEach((def, i) => {
        meshes[i].position.set(...def.start.p);
        meshes[i].rotation.set(...def.start.r);
        meshes[i].material.opacity = 0;
        ghosts[i].material.opacity = 0.85;
      });
      group.scale.set(1, 1, 1);
      dimsFadeState.value = 0;
      dimsOn = false;
      setDimsVisible(false);
    }

    buildTasks();

    resetRef.current = () => {
      resetScene();
      clockStart = performance.now();
      buildTasks();
    };
    toggleDimsRef.current = () => {
      dimsOn = !dimsOn;
      setDimsVisible(dimsOn);
      
      const fromValue = dimsFadeState.value;
      const toValue = dimsOn ? 1 : 0;
      const currentTime = performance.now() - clockStart;
      
      tasks.push(makeTask(dimsFadeState, { value: fromValue }, { value: toValue }, currentTime, 300, 'linear'));
    };

    const onPointerDown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; };
    const onPointerUp = () => { dragging = false; };
    const onPointerMove = (e) => {
      if (!dragging) return;
      camAngle -= (e.clientX - lastX) * 0.005;
      camElev = Math.max(0.06, Math.min(0.75, camElev + (e.clientY - lastY) * 0.004));
      lastX = e.clientX; lastY = e.clientY;
    };
    host.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    function tick(now) {
      const elapsed = now - clockStart;
      tasks.forEach((task) => task.update(elapsed));
      setGroupOpacity(dimsGroup, dimsFadeState.value);
      if (!dragging) { idleAngle += 0.0016; camAngle += Math.sin(idleAngle) * 0.00002; }
      updateCamera();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);

    const onResize = () => {
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerdown', onPointerDown);

      meshes.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
      ghosts.forEach((g) => { g.geometry.dispose(); g.material.dispose(); });
      dimsGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) { if (obj.material.map) obj.material.map.dispose(); obj.material.dispose(); }
      });
      woodTex.dispose();
      renderer.dispose();
      if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
    };
  }, []);

  const handleReplay = useCallback(() => { resetRef.current(); }, []);
  const handleToggleDims = useCallback(() => { toggleDimsRef.current(); }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '620px', background: '#16283D' }}>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0, cursor: 'grab' }} />

      <div style={{
        position: 'absolute', top: 24, left: 24, maxWidth: 280,
        fontFamily: 'ui-monospace, "SFMono-Regular", "Courier New", monospace',
        color: '#EAF2FA', pointerEvents: 'none',
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.28em', color: '#C9A227', textTransform: 'uppercase', marginBottom: 6 }}>
          Taller Digital · Plano 11-C
        </div>
        <h1 style={{ fontSize: 18, margin: '0 0 4px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          Closet Organizador
        </h1>
        <div style={{ fontSize: 11, color: 'rgba(234,242,250,0.55)' }}>Secuencia de ensamblaje automática</div>
        <div style={{ fontSize: 10.5, color: 'rgba(234,242,250,0.55)', marginTop: 4 }}>120 × 180 × 50 cm · Madera nogal</div>
        <div style={{ width: 46, height: 1, background: '#6E94BF', opacity: 0.5, margin: '10px 0' }} />
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: 10.2, lineHeight: 1.75 }}>
          {partNames.map((name, i) => (
            <li key={name} style={{ color: doneFlags[i] ? '#EAF2FA' : 'rgba(234,242,250,0.55)' }}>
              <span style={{ color: doneFlags[i] ? '#7CD0A6' : '#C9A227', marginRight: 8 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {name}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleReplay}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Reiniciar ensamblaje"
      >
        <RotateCcw size={16} />nospace, "SFMono-Regular", "Courier New", monospace',
          fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
          padding: '10px 18px', cursor: 'pointer',
        }}
      >
        Reiniciar ensamblaje
      </button>

      <button
        onClick={handleToggleDims}
        style={{
          position: 'absolute', bottom: 24, left: 214,
          background: 'transparent', border: '1px solid #6E94BF', color: '#EAF2FA',
          fontFamily: 'ui-monospace, "SFMono-Regular", "Courier New", monospace',
          fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
          padding: '10px 18px', cursor: 'pointer', opacity: 0.9,
        }}
      >
        {dimsVisible ? 'Ocultar medidas' : 'Mostrar medidas'}
      </button>

      <div style={{
        position: 'absolute', bottom: 24, right: 24, textAlign: 'right',
        fontFamily: 'ui-monospace, "SFMono-Regular", "Courier New", monospace',
        fontSize: 10, color: 'rgba(234,242,250,0.55)', letterSpacing: '0.1em',
      }}>
        <span style={{ fontSize: 26, color: '#EAF2FA', display: 'block', marginBottom: 2 }}>
          {progress}/{partNames.length || 14}
        </span>
        piezas colocadas
      </div>
    </div>
  );
}
