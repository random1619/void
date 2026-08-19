import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';

export type WatchFinish = 'obsidian' | 'platinum' | 'rosegold' | 'emerald';
export type CameraPreset = 'front' | 'profile' | 'exploded' | 'back';

export interface Watch3DCanvasRef {
  setCameraPreset: (preset: CameraPreset) => void;
  setFinish: (finish: WatchFinish) => void;
  setExplodeProgress: (progress: number) => void;
  setWireframe: (wireframe: boolean) => void;
  resetView: () => void;
  focusLayer?: (layerIndex: number) => void;
}

interface Watch3DCanvasProps {
  finish?: WatchFinish;
  cameraPreset?: CameraPreset;
  explodeProgress?: number;
  wireframe?: boolean;
  onExplodeChange?: (progress: number) => void;
  className?: string;
}

const FINISH_PALETTES = {
  obsidian: {
    case: 0x1a1c1e, bezel: 0x24272a, accent: 0xd4af37, dial: 0x0c0d0e,
    hands: 0xf1f5f9, strap: 0x121314, glass: 0xa5f3fc, jewel: 0xb91c1c,
    lumi: 0x38bdf8, metalness: 0.94, roughness: 0.16,
  },
  platinum: {
    case: 0xe2e8f0, bezel: 0xf1f5f9, accent: 0x06b6d4, dial: 0x0f172a,
    hands: 0xffffff, strap: 0x1e293b, glass: 0x67e8f9, jewel: 0xd97706,
    lumi: 0x22d3ee, metalness: 0.97, roughness: 0.1,
  },
  rosegold: {
    case: 0xb87333, bezel: 0xc98444, accent: 0xfacc15, dial: 0x1c1311,
    hands: 0xffedd5, strap: 0x2d1d17, glass: 0xfed7aa, jewel: 0x991b1b,
    lumi: 0xfde047, metalness: 0.91, roughness: 0.14,
  },
  emerald: {
    case: 0x132a22, bezel: 0xd4af37, accent: 0x10b981, dial: 0x041c14,
    hands: 0xfef08a, strap: 0x09261c, glass: 0xa7f3d0, jewel: 0xb91c1c,
    lumi: 0x34d399, metalness: 0.89, roughness: 0.18,
  },
};

// ─── PROCEDURAL TEXTURE GENERATORS ───────────────────────────────────────────

function createStudioEnvironmentTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, '#030508');
  bg.addColorStop(0.35, '#0a0f18');
  bg.addColorStop(0.65, '#0a0f18');
  bg.addColorStop(1, '#030508');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const softbox = (cx: number, cy: number, rx: number, ry: number, color: string, alpha: number) => {
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(rx, ry));
    g.addColorStop(0, color);
    g.addColorStop(0.3, color.replace(/[\d.]+\)$/, `${alpha * 0.6})`));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
  };

  // Key softbox — large, warm, top-center
  softbox(1024, 180, 640, 320, 'rgba(255,252,245,1.0)', 1);
  // Fill softbox — cool, left
  softbox(300, 512, 280, 400, 'rgba(200,230,255,0.7)', 0.7);
  // Rim softbox — warm gold, right
  softbox(1700, 400, 220, 360, 'rgba(255,220,160,0.65)', 0.65);
  // Bottom bounce — subtle warm
  softbox(1024, 860, 500, 160, 'rgba(255,240,220,0.35)', 0.35);
  // Edge kicker — cool blue, far left bottom
  softbox(80, 800, 180, 200, 'rgba(180,220,255,0.4)', 0.4);

  // Horizontal strip lights (like LED panels in a real studio)
  const strip = ctx.createLinearGradient(600, 0, 1400, 0);
  strip.addColorStop(0, 'rgba(0,0,0,0)');
  strip.addColorStop(0.3, 'rgba(255,255,255,0.12)');
  strip.addColorStop(0.5, 'rgba(255,255,255,0.18)');
  strip.addColorStop(0.7, 'rgba(255,255,255,0.12)');
  strip.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = strip;
  ctx.fillRect(600, 460, 800, 30);

  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.needsUpdate = true;
  return tex;
}

function createRadialBrushedTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 1024);

  const cx = 512, cy = 512;
  for (let i = 0; i < 3000; i++) {
    const angle = i * 0.00209 + (i * 0.618) % (Math.PI * 2);
    const r1 = 30 + (i * 7.3) % 460;
    const alpha = 0.02 + (i % 20) * 0.004;
    ctx.strokeStyle = i % 3 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
    ctx.lineWidth = 0.5 + (i % 7) * 0.18;
    ctx.beginPath();
    ctx.arc(cx, cy, r1, angle, angle + 0.04);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createMicroImperfectionMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 600; i++) {
    const x = (i * 37.7) % 512;
    const y = (i * 23.3) % 512;
    const len = 2 + (i % 12);
    const angle = (i * 0.73) % (Math.PI * 2);
    ctx.strokeStyle = `rgba(${i % 2 === 0 ? '200,200,200' : '60,60,60'},${0.04 + (i % 10) * 0.008})`;
    ctx.lineWidth = 0.3 + (i % 4) * 0.15;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createGenevaStripesTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);
  const stripeH = 20;
  for (let y = 0; y < 512; y += stripeH) {
    const g = ctx.createLinearGradient(0, y, 0, y + stripeH);
    g.addColorStop(0, '#505050');
    g.addColorStop(0.4, '#b0b0b0');
    g.addColorStop(0.6, '#b0b0b0');
    g.addColorStop(1, '#505050');
    ctx.fillStyle = g;
    ctx.fillRect(0, y, 512, stripeH);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createPerlageTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);
  const r = 14, step = 18;
  for (let y = 0; y <= 512 + step; y += step) {
    for (let x = 0; x <= 512 + step; x += step) {
      const g = ctx.createRadialGradient(x, y, 1, x, y, r);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.65, '#888888');
      g.addColorStop(1, '#3a3a3a');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

function createGuillocheDialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;
  const cx = 1024, cy = 1024;

  ctx.fillStyle = '#0a0b0d';
  ctx.fillRect(0, 0, 2048, 2048);

  // Fine radial sunburst brushing
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 720; i++) {
    const a = (i / 720) * Math.PI * 2;
    const alpha = 0.03 + (i % 4) * 0.008;
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 80, Math.sin(a) * 80);
    ctx.lineTo(Math.cos(a) * 940, Math.sin(a) * 940);
    ctx.stroke();
  }
  ctx.restore();

  // Concentric guilloché rings
  ctx.strokeStyle = 'rgba(212,175,55,0.18)';
  ctx.lineWidth = 1.2;
  for (let r = 120; r < 950; r += 6) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Minute track — 60 marks around the outer edge
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isMaj = i % 5 === 0;
    const r1 = isMaj ? 880 : 900;
    const r2 = 940;
    ctx.strokeStyle = isMaj ? 'rgba(212,175,55,0.7)' : 'rgba(200,200,200,0.3)';
    ctx.lineWidth = isMaj ? 3 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    ctx.stroke();
  }

  // Branding
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('VOID', cx, 500);
  ctx.fillStyle = '#d4af37';
  ctx.font = '600 32px "Space Mono", monospace';
  ctx.fillText('MONOLITH AUTOMATIC', cx, 570);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 26px "Space Mono", monospace';
  ctx.fillText('CALIBER V-01  •  72 HOURS', cx, 1500);
  ctx.fillText('SWISS MADE', cx, 1780);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export const Watch3DCanvas = forwardRef<Watch3DCanvasRef, Watch3DCanvasProps>(
  ({ finish = 'obsidian', cameraPreset = 'front', explodeProgress = 0, wireframe = false, className = '' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    const mainGroupRef = useRef<THREE.Group | null>(null);
    const crystalLayerRef = useRef<THREE.Group | null>(null);
    const bezelLayerRef = useRef<THREE.Group | null>(null);
    const dialLayerRef = useRef<THREE.Group | null>(null);
    const caliberLayerRef = useRef<THREE.Group | null>(null);
    const caseLayerRef = useRef<THREE.Group | null>(null);

    const hourHandGroupRef = useRef<THREE.Group | null>(null);
    const minHandGroupRef = useRef<THREE.Group | null>(null);
    const secHandGroupRef = useRef<THREE.Group | null>(null);
    const subSecHandRef = useRef<THREE.Group | null>(null);
    const subMinHandRef = useRef<THREE.Group | null>(null);
    const subHourHandRef = useRef<THREE.Group | null>(null);

    const balanceWheelRef = useRef<THREE.Group | null>(null);
    const gearTrainGroupRef = useRef<THREE.Group | null>(null);
    const escapeWheelRef = useRef<THREE.Group | null>(null);
    const rotorRef = useRef<THREE.Group | null>(null);

    const materialsRef = useRef<Record<string, THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial>>({});
    const targetRotationRef = useRef({ x: 0, y: 0, z: 0 });
    const targetCameraPosRef = useRef({ x: 0, y: 0, z: 5.5 });
    const explodeValRef = useRef(explodeProgress);
    const mousePosRef = useRef({ x: 0, y: 0 });

    useEffect(() => { explodeValRef.current = explodeProgress; }, [explodeProgress]);

    const applyCameraPreset = (preset: CameraPreset) => {
      switch (preset) {
        case 'front':
          targetCameraPosRef.current = { x: 0, y: 0, z: 5.5 };
          targetRotationRef.current = { x: 0, y: 0, z: 0 };
          break;
        case 'profile':
          targetCameraPosRef.current = { x: 3.8, y: 0.9, z: 3.6 };
          targetRotationRef.current = { x: 0.25, y: Math.PI / 2.8, z: 0 };
          break;
        case 'exploded':
          targetCameraPosRef.current = { x: 2.2, y: 1.4, z: 6.2 };
          targetRotationRef.current = { x: 0.38, y: -0.45, z: 0.12 };
          break;
        case 'back':
          targetCameraPosRef.current = { x: 0, y: 0, z: -5.5 };
          targetRotationRef.current = { x: 0, y: Math.PI, z: 0 };
          break;
      }
    };

    const applyFinish = (f: WatchFinish) => {
      const p = FINISH_PALETTES[f] || FINISH_PALETTES.obsidian;
      const m = materialsRef.current;
      if (m.case)  { m.case.color.setHex(p.case); m.case.metalness = p.metalness; m.case.roughness = p.roughness; }
      if (m.bezel) { m.bezel.color.setHex(p.bezel); m.bezel.metalness = p.metalness; m.bezel.roughness = p.roughness * 0.8; }
      if (m.accent) m.accent.color.setHex(p.accent);
      if (m.dial)   m.dial.color.setHex(p.dial);
      if (m.hands)  m.hands.color.setHex(p.hands);
      if (m.strap)  m.strap.color.setHex(p.strap);
      if (m.jewel)  m.jewel.color.setHex(p.jewel);
      if (m.lumi)   m.lumi.color.setHex(p.lumi);
    };

    const applyWireframe = (wf: boolean) => {
      Object.values(materialsRef.current).forEach((mat) => { if (mat) mat.wireframe = wf; });
    };

    useImperativeHandle(ref, () => ({
      setCameraPreset: (p: CameraPreset) => applyCameraPreset(p),
      setFinish: (f: WatchFinish) => applyFinish(f),
      setExplodeProgress: (p: number) => { explodeValRef.current = p; },
      setWireframe: (w: boolean) => applyWireframe(w),
      resetView: () => applyCameraPreset('front'),
    }));

    useEffect(() => { applyCameraPreset(cameraPreset); }, [cameraPreset]);
    useEffect(() => { applyFinish(finish); }, [finish]);
    useEffect(() => { applyWireframe(wireframe); }, [wireframe]);

    // ─── MAIN SCENE INIT ─────────────────────────────────────────────────────
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      sceneRef.current = scene;
      const envTexture = createStudioEnvironmentTexture();
      scene.environment = envTexture;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(0, 0, 5.5);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        alpha: true, antialias: true, powerPreference: 'high-performance', precision: 'highp',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // ─── LIGHTING (5-point studio) ──────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.65));

      const keyLight = new THREE.DirectionalLight(0xfff5e0, 3.8);
      keyLight.position.set(5, 7, 6);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xe0f0ff, 2.0);
      fillLight.position.set(-6, -3, 4);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight(0xd4af37, 4.5, 28);
      rimLight.position.set(0, 6, -6);
      scene.add(rimLight);

      const bounceLight = new THREE.PointLight(0xffeedd, 1.6, 20);
      bounceLight.position.set(-3, -5, 3);
      scene.add(bounceLight);

      const kickerLight = new THREE.SpotLight(0xd0e8ff, 2.2, 18, Math.PI / 6, 0.5);
      kickerLight.position.set(6, -2, -4);
      kickerLight.target.position.set(0, 0, 0);
      scene.add(kickerLight);
      scene.add(kickerLight.target);

      // Contact shadow plane
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256; shadowCanvas.height = 256;
      const sCtx = shadowCanvas.getContext('2d')!;
      const sg = sCtx.createRadialGradient(128, 128, 8, 128, 128, 120);
      sg.addColorStop(0, 'rgba(0,0,0,0.65)');
      sg.addColorStop(0.5, 'rgba(0,0,0,0.18)');
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = sg;
      sCtx.fillRect(0, 0, 256, 256);
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadowMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity: 0.7 })
      );
      shadowMesh.position.set(0, -3.2, 0);
      shadowMesh.rotation.x = -Math.PI / 2;
      scene.add(shadowMesh);

      // ─── TEXTURES ──────────────────────────────────────────────────────────
      const palette = FINISH_PALETTES[finish] || FINISH_PALETTES.obsidian;
      const brushedMap = createRadialBrushedTexture();
      const imperfMap = createMicroImperfectionMap();
      const genevaMap = createGenevaStripesTexture();
      const perlageMap = createPerlageTexture();
      const dialMap = createGuillocheDialTexture();

      // ─── PBR MATERIALS ─────────────────────────────────────────────────────
      const mats = {
        case: new THREE.MeshStandardMaterial({
          color: palette.case, metalness: palette.metalness, roughness: palette.roughness,
          roughnessMap: brushedMap, bumpMap: imperfMap, bumpScale: 0.003,
          envMapIntensity: 2.6, wireframe,
        }),
        bezel: new THREE.MeshStandardMaterial({
          color: palette.bezel, metalness: palette.metalness, roughness: palette.roughness * 0.7,
          roughnessMap: brushedMap, envMapIntensity: 3.0, wireframe,
        }),
        accent: new THREE.MeshStandardMaterial({
          color: palette.accent, metalness: 0.97, roughness: 0.06,
          envMapIntensity: 3.5, wireframe,
        }),
        dial: new THREE.MeshStandardMaterial({
          color: palette.dial, map: dialMap, metalness: 0.5, roughness: 0.22,
          envMapIntensity: 1.5, wireframe,
        }),
        movementPlate: new THREE.MeshStandardMaterial({
          color: palette.case, metalness: 0.88, roughness: 0.22,
          bumpMap: genevaMap, bumpScale: 0.025, envMapIntensity: 2.2, wireframe,
        }),
        mainplatePerlage: new THREE.MeshStandardMaterial({
          color: 0x33383e, metalness: 0.9, roughness: 0.26,
          bumpMap: perlageMap, bumpScale: 0.035, envMapIntensity: 2.4, wireframe,
        }),
        hands: new THREE.MeshStandardMaterial({
          color: palette.hands, metalness: 0.98, roughness: 0.04,
          envMapIntensity: 4.0, wireframe,
        }),
        lumi: new THREE.MeshStandardMaterial({
          color: palette.lumi, emissive: palette.lumi, emissiveIntensity: 0.8,
          roughness: 0.12, wireframe,
        }),
        strap: new THREE.MeshStandardMaterial({
          color: palette.strap, metalness: 0.78, roughness: 0.28,
          bumpMap: imperfMap, bumpScale: 0.005, envMapIntensity: 1.8, wireframe,
        }),
        jewel: new THREE.MeshPhysicalMaterial({
          color: palette.jewel, transparent: true, opacity: 0.94,
          roughness: 0.03, metalness: 0.08, transmission: 0.9,
          ior: 1.76, wireframe,
        }),
        glass: new THREE.MeshPhysicalMaterial({
          color: palette.glass, transparent: true, opacity: 0.28,
          roughness: 0.02, metalness: 0.03, transmission: 0.97,
          ior: 1.77, thickness: 0.45, clearcoat: 1.0, clearcoatRoughness: 0.015,
          wireframe,
        }),
      };
      materialsRef.current = mats;

      // ─── DUST PARTICLES ────────────────────────────────────────────────────
      const pGeo = new THREE.BufferGeometry();
      const pCount = 200;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount * 3; i += 3) {
        pPos[i] = ((i * 37.7) % 1200 - 600) / 100;
        pPos[i + 1] = ((i * 23.3) % 1200 - 600) / 100;
        pPos[i + 2] = ((i * 17.1) % 1200 - 600) / 100;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const dustParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 0.04, color: palette.accent, transparent: true, opacity: 0.4,
      }));
      scene.add(dustParticles);

      // ─── WATCH MESH HIERARCHY ──────────────────────────────────────────────
      const mainGroup = new THREE.Group();
      mainGroupRef.current = mainGroup;
      scene.add(mainGroup);

      // LAYER 1: SAPPHIRE CRYSTAL
      const crystalLayer = new THREE.Group();
      crystalLayerRef.current = crystalLayer;
      mainGroup.add(crystalLayer);

      const glassMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.88, 1.88, 0.09, 96),
        mats.glass
      );
      glassMesh.rotation.x = Math.PI / 2;
      glassMesh.position.z = 0.58;
      crystalLayer.add(glassMesh);

      // Domed crystal edge ring for AR coating catch
      const crystalEdge = new THREE.Mesh(
        new THREE.TorusGeometry(1.88, 0.02, 16, 96),
        mats.accent
      );
      crystalEdge.position.z = 0.58;
      crystalLayer.add(crystalEdge);

      // LAYER 2: BEZEL + TACHYMETER + SCREWS
      const bezelLayer = new THREE.Group();
      bezelLayerRef.current = bezelLayer;
      mainGroup.add(bezelLayer);

      const bezelMesh = new THREE.Mesh(
        new THREE.TorusGeometry(1.92, 0.19, 32, 8),
        mats.bezel
      );
      bezelMesh.position.z = 0.46;
      bezelLayer.add(bezelMesh);

      // Inner bezel flange ring
      const flangeRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.82, 0.04, 16, 64),
        mats.accent
      );
      flangeRing.position.z = 0.50;
      bezelLayer.add(flangeRing);

      // 8 engraved bezel screws
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const screwGroup = new THREE.Group();
        screwGroup.position.set(Math.cos(a) * 1.90, Math.sin(a) * 1.90, 0.47);
        screwGroup.rotation.x = Math.PI / 2;
        screwGroup.rotation.z = a;

        const head = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 24), mats.accent);
        screwGroup.add(head);

        // Screw slot
        const slot = new THREE.Mesh(
          new THREE.BoxGeometry(0.065, 0.015, 0.12),
          new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.5, roughness: 0.8, wireframe })
        );
        slot.position.y = 0.001;
        screwGroup.add(slot);

        bezelLayer.add(screwGroup);
      }

      // LAYER 3: DIAL + SUB-DIALS + HANDS
      const dialLayer = new THREE.Group();
      dialLayerRef.current = dialLayer;
      mainGroup.add(dialLayer);

      // Main dial face
      const dialMesh = new THREE.Mesh(new THREE.CircleGeometry(1.8, 96), mats.dial);
      dialMesh.position.z = 0.38;
      dialLayer.add(dialMesh);

      // Beveled date window at 4:30
      const dAngle = -Math.PI / 4;
      const dateFrame = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.30, 0.07), mats.accent);
      dateFrame.position.set(Math.cos(dAngle) * 1.15, Math.sin(dAngle) * 1.15, 0.415);
      dialLayer.add(dateFrame);

      // Date window inset
      const dateInset = new THREE.Mesh(
        new THREE.BoxGeometry(0.30, 0.22, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.6, wireframe })
      );
      dateInset.position.set(Math.cos(dAngle) * 1.15, Math.sin(dAngle) * 1.15, 0.42);
      dialLayer.add(dateInset);

      // Chronograph sub-dials
      const subDials = [
        { id: 'sec', x: -0.65, y: 0.1, r: 0.38 },
        { id: 'min', x: 0.65, y: 0.1, r: 0.38 },
        { id: 'hr', x: 0, y: -0.65, r: 0.42 },
      ];

      subDials.forEach((sd) => {
        // Sub-dial recessed ring
        const ring = new THREE.Mesh(new THREE.RingGeometry(sd.r - 0.04, sd.r, 48), mats.accent);
        ring.position.set(sd.x, sd.y, 0.395);
        dialLayer.add(ring);

        // Sub-dial tick marks (12 marks per sub-dial)
        for (let t = 0; t < 12; t++) {
          const ta = (t / 12) * Math.PI * 2;
          const isMajor = t % 3 === 0;
          const tick = new THREE.Mesh(
            new THREE.BoxGeometry(0.01, isMajor ? 0.07 : 0.04, 0.02),
            mats.accent
          );
          tick.position.set(
            sd.x + Math.cos(ta) * (sd.r - 0.06),
            sd.y + Math.sin(ta) * (sd.r - 0.06),
            0.4
          );
          tick.rotation.z = ta - Math.PI / 2;
          dialLayer.add(tick);
        }

        // Sub-dial hand
        const handGroup = new THREE.Group();
        handGroup.position.set(sd.x, sd.y, 0.42);
        const handMesh = new THREE.Mesh(new THREE.BoxGeometry(0.018, sd.r * 0.85, 0.025), mats.accent);
        handMesh.position.set(0, sd.r * 0.38, 0);
        handGroup.add(handMesh);
        // Hand pinion
        const pinion = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 16), mats.accent);
        pinion.rotation.x = Math.PI / 2;
        handGroup.add(pinion);
        dialLayer.add(handGroup);

        if (sd.id === 'sec') subSecHandRef.current = handGroup;
        if (sd.id === 'min') subMinHandRef.current = handGroup;
        if (sd.id === 'hr') subHourHandRef.current = handGroup;
      });

      // Applied faceted hour markers with lume
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        const isMajor = i % 3 === 0;
        const mr = 1.62;
        const mGroup = new THREE.Group();
        mGroup.position.set(Math.cos(a) * mr, Math.sin(a) * mr, 0.41);
        mGroup.rotation.z = a - Math.PI / 2;

        const base = new THREE.Mesh(
          new THREE.BoxGeometry(isMajor ? 0.10 : 0.05, isMajor ? 0.26 : 0.15, 0.055),
          mats.accent
        );
        mGroup.add(base);

        const lume = new THREE.Mesh(
          new THREE.BoxGeometry(isMajor ? 0.055 : 0.028, isMajor ? 0.19 : 0.10, 0.06),
          mats.lumi
        );
        mGroup.add(lume);

        dialLayer.add(mGroup);
      }

      // Central hands assembly
      const handsGroup = new THREE.Group();
      dialLayer.add(handsGroup);

      // Center pinion
      const centerPinion = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.2, 32), mats.accent);
      centerPinion.rotation.x = Math.PI / 2;
      centerPinion.position.z = 0.46;
      handsGroup.add(centerPinion);

      // Hour hand — dauphine style (tapered)
      const hourHandGroup = new THREE.Group();
      hourHandGroupRef.current = hourHandGroup;
      handsGroup.add(hourHandGroup);
      const hourStem = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.98, 0.05), mats.hands);
      hourStem.position.set(0, 0.36, 0.48);
      hourHandGroup.add(hourStem);
      const hourLumi = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.62, 0.055), mats.lumi);
      hourLumi.position.set(0, 0.36, 0.485);
      hourHandGroup.add(hourLumi);

      // Minute hand — longer, thinner
      const minHandGroup = new THREE.Group();
      minHandGroupRef.current = minHandGroup;
      handsGroup.add(minHandGroup);
      const minStem = new THREE.Mesh(new THREE.BoxGeometry(0.065, 1.48, 0.045), mats.hands);
      minStem.position.set(0, 0.56, 0.51);
      minHandGroup.add(minStem);
      const minLumi = new THREE.Mesh(new THREE.BoxGeometry(0.032, 1.02, 0.055), mats.lumi);
      minLumi.position.set(0, 0.56, 0.515);
      minHandGroup.add(minLumi);

      // Seconds hand — thin with counterweight
      const secHandGroup = new THREE.Group();
      secHandGroupRef.current = secHandGroup;
      handsGroup.add(secHandGroup);
      const secStem = new THREE.Mesh(new THREE.BoxGeometry(0.022, 1.72, 0.035), mats.accent);
      secStem.position.set(0, 0.6, 0.54);
      secHandGroup.add(secStem);
      // Counterweight
      const secCounter = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.32, 0.035), mats.accent);
      secCounter.position.set(0, -0.25, 0.54);
      secHandGroup.add(secCounter);
      const secTip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), mats.accent);
      secTip.position.set(0, 1.38, 0.54);
      secHandGroup.add(secTip);

      // LAYER 4: CALIBER V-01 MOVEMENT
      const caliberLayer = new THREE.Group();
      caliberLayerRef.current = caliberLayer;
      mainGroup.add(caliberLayer);

      // Perlage mainplate
      const perlagePlate = new THREE.Mesh(
        new THREE.CylinderGeometry(1.68, 1.68, 0.08, 48),
        mats.mainplatePerlage
      );
      perlagePlate.rotation.x = Math.PI / 2;
      perlagePlate.position.z = 0.18;
      caliberLayer.add(perlagePlate);

      // Geneva-stripe bridge plates (two bridges at different angles)
      const addBridge = (startAngle: number, sweepAngle: number, z: number) => {
        const bridge = new THREE.Mesh(
          new THREE.CylinderGeometry(1.64, 1.64, 0.07, 48, 1, false, startAngle, sweepAngle),
          mats.movementPlate
        );
        bridge.rotation.x = Math.PI / 2;
        bridge.position.z = z;
        caliberLayer.add(bridge);

        // Bridge screws (2 per bridge)
        for (let i = 0; i < 2; i++) {
          const sa = startAngle + sweepAngle * (0.2 + i * 0.6);
          const bScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.08, 16), mats.accent);
          bScrew.position.set(Math.cos(sa) * 1.35, Math.sin(sa) * 1.35, z + 0.04);
          bScrew.rotation.x = Math.PI / 2;
          caliberLayer.add(bScrew);
        }
      };
      addBridge(0, Math.PI * 0.8, 0.24);
      addBridge(Math.PI, Math.PI * 0.7, 0.24);

      // Gear train — 8 gears for realistic density
      const gearTrainGroup = new THREE.Group();
      gearTrainGroupRef.current = gearTrainGroup;
      caliberLayer.add(gearTrainGroup);

      const gearData = [
        { x: -0.45, y: 0.45, r: 0.42, teeth: 28 },
        { x: 0.42, y: 0.35, r: 0.52, teeth: 36 },
        { x: -0.25, y: -0.45, r: 0.58, teeth: 40 },
        { x: 0.48, y: -0.38, r: 0.32, teeth: 20 },
        { x: -0.7, y: -0.1, r: 0.28, teeth: 18 },
        { x: 0.15, y: 0.7, r: 0.24, teeth: 16 },
        { x: -0.5, y: 0.75, r: 0.20, teeth: 14 },
        { x: 0.72, y: -0.15, r: 0.26, teeth: 16 },
      ];

      gearData.forEach((g) => {
        const gear = new THREE.Mesh(
          new THREE.CylinderGeometry(g.r, g.r, 0.06, g.teeth),
          mats.accent
        );
        gear.rotation.x = Math.PI / 2;
        gear.position.set(g.x, g.y, 0.28);
        gearTrainGroup.add(gear);

        // Axle pin
        const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 12), mats.hands);
        axle.rotation.x = Math.PI / 2;
        axle.position.set(g.x, g.y, 0.28);
        caliberLayer.add(axle);

        // Ruby jewel bearing
        const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.065, 20, 20), mats.jewel);
        jewel.position.set(g.x, g.y, 0.33);
        caliberLayer.add(jewel);
      });

      // Escape wheel (star-shaped)
      const escapeGroup = new THREE.Group();
      escapeGroup.position.set(0.3, 0.15, 0.30);
      escapeWheelRef.current = escapeGroup;
      caliberLayer.add(escapeGroup);
      const escapeWheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.04, 15),
        mats.accent
      );
      escapeWheel.rotation.x = Math.PI / 2;
      escapeGroup.add(escapeWheel);

      // Mainspring barrel
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.45, 0.12, 48),
        mats.case
      );
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(-0.55, -0.55, 0.22);
      caliberLayer.add(barrel);
      // Barrel arbor
      const arbor = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.16, 16), mats.accent);
      arbor.rotation.x = Math.PI / 2;
      arbor.position.set(-0.55, -0.55, 0.22);
      caliberLayer.add(arbor);

      // Balance wheel + hairspring
      const balanceGroup = new THREE.Group();
      balanceGroup.position.set(0.42, -0.38, 0.3);
      balanceWheelRef.current = balanceGroup;
      caliberLayer.add(balanceGroup);

      const balanceRim = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.032, 20, 48), mats.accent);
      balanceGroup.add(balanceRim);

      // Balance wheel spoke cross
      for (let i = 0; i < 4; i++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.68, 0.02), mats.accent);
        spoke.rotation.z = (i * Math.PI) / 4;
        balanceGroup.add(spoke);
      }

      // Hairspring spiral
      const spiralPts: THREE.Vector3[] = [];
      for (let t = 0; t < Math.PI * 8; t += 0.08) {
        const r = 0.04 + 0.012 * t;
        spiralPts.push(new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), 0.015));
      }
      const hairspring = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(spiralPts),
        new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })
      );
      balanceGroup.add(hairspring);

      // LAYER 5: CASE BODY, CROWN, PUSHERS, STRAP
      const caseLayer = new THREE.Group();
      caseLayerRef.current = caseLayer;
      mainGroup.add(caseLayer);

      // Case body — higher-segment octagonal
      const caseMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(2.12, 2.24, 0.80, 8, 1),
        mats.case
      );
      caseMesh.rotation.x = Math.PI / 2;
      caseLayer.add(caseMesh);

      // Case mid-band (polished bevel between brushed surfaces)
      const midBand = new THREE.Mesh(
        new THREE.TorusGeometry(2.18, 0.03, 12, 8),
        mats.accent
      );
      caseLayer.add(midBand);

      // Crown with knurling
      const crownGroup = new THREE.Group();
      crownGroup.position.set(2.30, 0, 0);
      caseLayer.add(crownGroup);

      const crownBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.4, 32), mats.bezel);
      crownBody.rotation.z = Math.PI / 2;
      crownGroup.add(crownBody);
      // Knurling ridges on crown
      for (let i = 0; i < 20; i++) {
        const ka = (i / 20) * Math.PI * 2;
        const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.012, 0.012), mats.accent);
        ridge.position.set(0, Math.cos(ka) * 0.24, Math.sin(ka) * 0.24);
        ridge.rotation.x = ka;
        crownGroup.add(ridge);
      }
      // Crown logo
      const crownLogo = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.16, 0.16), mats.accent);
      crownLogo.position.set(0.21, 0, 0);
      crownGroup.add(crownLogo);

      // Chronograph pushers
      const pusherGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.34, 20);
      const topPusher = new THREE.Mesh(pusherGeo, mats.accent);
      topPusher.rotation.z = Math.PI / 3;
      topPusher.position.set(2.10, 1.08, 0);
      caseLayer.add(topPusher);
      const botPusher = new THREE.Mesh(pusherGeo, mats.accent);
      botPusher.rotation.z = -Math.PI / 3;
      botPusher.position.set(2.10, -1.08, 0);
      caseLayer.add(botPusher);

      // Bracelet links with chamfered edges
      for (let s = 1; s <= 4; s++) {
        const lw = 1.98 - s * 0.08;
        const linkGeo = new THREE.BoxGeometry(lw, 0.58, 0.24);
        const topLink = new THREE.Mesh(linkGeo, mats.strap);
        topLink.position.set(0, 2.12 + s * 0.50, -s * 0.06);
        topLink.rotation.x = -s * 0.06;
        caseLayer.add(topLink);
        const botLink = new THREE.Mesh(linkGeo, mats.strap);
        botLink.position.set(0, -2.12 - s * 0.50, -s * 0.06);
        botLink.rotation.x = s * 0.06;
        caseLayer.add(botLink);

        // Link pins
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, lw * 0.9, 8), mats.accent);
        pin.rotation.z = Math.PI / 2;
        pin.position.set(0, 2.12 + s * 0.50, -s * 0.06 + 0.08);
        caseLayer.add(pin);
        const pin2 = pin.clone();
        pin2.position.set(0, -2.12 - s * 0.50, -s * 0.06 + 0.08);
        caseLayer.add(pin2);
      }

      // Exhibition caseback glass
      const backGlass = new THREE.Mesh(
        new THREE.CylinderGeometry(1.68, 1.68, 0.06, 48),
        mats.glass
      );
      backGlass.rotation.x = Math.PI / 2;
      backGlass.position.z = -0.42;
      caseLayer.add(backGlass);

      // Kinetic rotor (half-circle)
      const rotorGroup = new THREE.Group();
      rotorRef.current = rotorGroup;
      caseLayer.add(rotorGroup);
      const rotorMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.48, 1.48, 0.05, 48, 1, false, 0, Math.PI),
        mats.accent
      );
      rotorMesh.rotation.x = Math.PI / 2;
      rotorMesh.position.z = -0.39;
      rotorGroup.add(rotorMesh);
      // Rotor bearing
      const rotorBearing = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 20), mats.jewel);
      rotorBearing.position.set(0, 0, -0.39);
      rotorGroup.add(rotorBearing);

      // ─── MOUSE INTERACTION ─────────────────────────────────────────────────
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mousePosRef.current = {
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        };
      };
      window.addEventListener('mousemove', handleMouseMove);

      // ─── ANIMATION LOOP ────────────────────────────────────────────────────
      let animationFrameId: number;
      const clock = new THREE.Clock();
      let isVisible = true;

      const visibilityObserver = new IntersectionObserver(
        (entries) => { isVisible = entries[0]?.isIntersecting ?? true; },
        { threshold: 0 }
      );
      visibilityObserver.observe(container);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (!isVisible) return;
        const t = clock.getElapsedTime();

        // Hands
        if (hourHandGroupRef.current) hourHandGroupRef.current.rotation.z = -t * 0.004;
        if (minHandGroupRef.current) minHandGroupRef.current.rotation.z = -t * 0.05;
        if (secHandGroupRef.current) secHandGroupRef.current.rotation.z = -t * 0.6;

        // Sub-dial hands
        if (subSecHandRef.current) subSecHandRef.current.rotation.z = -t * 0.8;
        if (subMinHandRef.current) subMinHandRef.current.rotation.z = -t * 0.08;
        if (subHourHandRef.current) subHourHandRef.current.rotation.z = -t * 0.008;

        // Gear train — alternating directions, varied speeds
        if (gearTrainGroupRef.current) {
          gearTrainGroupRef.current.children.forEach((gear, idx) => {
            const dir = idx % 2 === 0 ? 1 : -1;
            const speed = 1.8 + (idx % 3) * 0.6;
            gear.rotation.z = dir * t * speed;
          });
        }

        // Escape wheel — faster tick
        if (escapeWheelRef.current) {
          escapeWheelRef.current.rotation.z = t * 4.5;
        }

        // Balance wheel — 4Hz damped oscillation
        if (balanceWheelRef.current) {
          balanceWheelRef.current.rotation.z = Math.sin(t * 25.13) * 0.85;
        }

        // Rotor — gravity sway
        if (rotorRef.current) {
          rotorRef.current.rotation.z = Math.sin(t * 1.2) * 0.7 + Math.sin(t * 0.3) * 0.15;
        }

        // Dust
        dustParticles.rotation.y = t * 0.015;

        // Exploded layers
        const exp = explodeValRef.current;
        const gap = 1.45 * exp;
        if (crystalLayerRef.current) crystalLayerRef.current.position.z = gap * 2.3;
        if (bezelLayerRef.current) bezelLayerRef.current.position.z = gap * 1.55;
        if (dialLayerRef.current) dialLayerRef.current.position.z = gap * 0.85;
        if (caliberLayerRef.current) caliberLayerRef.current.position.z = gap * 0.22;
        if (caseLayerRef.current) caseLayerRef.current.position.z = -gap * 0.85;

        // Smooth camera dampening
        if (cameraRef.current && mainGroupRef.current) {
          const tc = targetCameraPosRef.current;
          const m = mousePosRef.current;
          const cam = cameraRef.current;
          cam.position.x += (tc.x + m.x * 0.35 - cam.position.x) * 0.05;
          cam.position.y += (tc.y - m.y * 0.35 - cam.position.y) * 0.05;
          cam.position.z += (tc.z - cam.position.z) * 0.05;

          const tr = targetRotationRef.current;
          const mg = mainGroupRef.current;
          mg.rotation.x += (tr.x + m.y * 0.18 - mg.rotation.x) * 0.05;
          mg.rotation.y += (tr.y + m.x * 0.28 - mg.rotation.y) * 0.05;
          mg.rotation.z += (tr.z - mg.rotation.z) * 0.05;
        }

        renderer.render(scene, camera);
      };
      animate();

      // ─── RESIZE HANDLING ───────────────────────────────────────────────────
      const handleResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);
      const resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(container);

      // ─── CLEANUP ───────────────────────────────────────────────────────────
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        visibilityObserver.disconnect();
        resizeObserver.disconnect();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else if (mat) mat.dispose();
        });
        envTexture.dispose();
        brushedMap.dispose();
        imperfMap.dispose();
        genevaMap.dispose();
        perlageMap.dispose();
        dialMap.dispose();
        shadowTexture.dispose();
        renderer.dispose();
        scene.clear();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className={`relative w-full h-full min-h-[400px] select-none ${className}`}>
        <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
      </div>
    );
  }
);

Watch3DCanvas.displayName = 'Watch3DCanvas';
