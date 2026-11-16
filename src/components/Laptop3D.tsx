import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function drawCodeEditorCanvas(canvas: HTMLCanvasElement, scale: number) {
  canvas.width = Math.round(1024 * scale);
  canvas.height = Math.round(640 * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.scale(scale, scale);

  // Deep IDE background
  ctx.fillStyle = '#070E1A';
  ctx.fillRect(0, 0, 1024, 640);

  // Subtle top ambient gradient inside editor
  const topGlow = ctx.createLinearGradient(0, 0, 1024, 240);
  topGlow.addColorStop(0, 'rgba(59, 130, 246, 0.14)');
  topGlow.addColorStop(1, 'rgba(11, 18, 32, 0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, 1024, 240);

  // Top Window Bar
  ctx.fillStyle = '#0D1729';
  ctx.fillRect(0, 0, 1024, 44);
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 43, 1024, 1);

  // Window buttons
  const dots = [
    { x: 24, color: '#F87171' },
    { x: 44, color: '#FBBF24' },
    { x: 64, color: '#34D399' },
  ];
  dots.forEach((d) => {
    ctx.beginPath();
    ctx.arc(d.x, 22, 6, 0, Math.PI * 2);
    ctx.fillStyle = d.color;
    ctx.fill();
  });

  // Editor Tabs
  const tabs = [
    { label: 'Hero.tsx', active: true, x: 210, w: 132 },
    { label: 'styles.css', active: false, x: 344, w: 126 },
    { label: 'index.html', active: false, x: 472, w: 128 },
    { label: 'main.js', active: false, x: 602, w: 112 },
  ];
  tabs.forEach((tab) => {
    if (tab.active) {
      ctx.fillStyle = '#070E1A';
      ctx.fillRect(tab.x, 4, tab.w, 40);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(tab.x, 4, tab.w, 3);
    }
    ctx.font = '500 15px "JetBrains Mono", monospace';
    ctx.fillStyle = tab.active ? '#F8FAFC' : '#64748B';
    ctx.fillText(tab.label, tab.x + 18, 29);
  });

  // Left Explorer Sidebar
  ctx.fillStyle = '#0A1324';
  ctx.fillRect(0, 44, 208, 566);
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(208, 44, 1, 566);

  ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('EXPLORER', 20, 76);

  const files = [
    { name: 'src/', color: '#94A3B8', indent: 20, active: false },
    { name: 'components/', color: '#94A3B8', indent: 34, active: false },
    { name: 'Hero.tsx', color: '#60A5FA', indent: 48, active: true },
    { name: 'Projects.tsx', color: '#CBD5E1', indent: 48, active: false },
    { name: 'Skills.tsx', color: '#CBD5E1', indent: 48, active: false },
    { name: 'styles.css', color: '#38BDF8', indent: 34, active: false },
    { name: 'index.html', color: '#FB923C', indent: 20, active: false },
    { name: 'app.js', color: '#FACC15', indent: 20, active: false },
  ];
  files.forEach((file, idx) => {
    const y = 108 + idx * 30;
    if (file.active) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.16)';
      ctx.fillRect(8, y - 18, 192, 26);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(8, y - 18, 3, 26);
    }
    ctx.font = '500 14px "JetBrains Mono", monospace';
    ctx.fillStyle = file.color;
    ctx.fillText(file.name, file.indent, y);
  });

  // Syntax Highlighted Code Lines (HTML, CSS, JS, React)
  const codeLines: { tokens: { text: string; color: string }[] }[] = [
    {
      tokens: [
        { text: '<!-- index.html · Semantic Document -->', color: '#64748B' },
      ],
    },
    {
      tokens: [
        { text: '<section ', color: '#38BDF8' },
        { text: 'id=', color: '#93C5FD' },
        { text: '"portfolio"', color: '#34D399' },
        { text: ' class=', color: '#93C5FD' },
        { text: '"navy-stage"', color: '#34D399' },
        { text: '>', color: '#38BDF8' },
      ],
    },
    { tokens: [] },
    {
      tokens: [
        { text: '/* styles.css · Electric Blue Accent */', color: '#64748B' },
      ],
    },
    {
      tokens: [
        { text: '.glow-card ', color: '#FBBF24' },
        { text: '{ ', color: '#CBD5E1' },
        { text: 'background: ', color: '#93C5FD' },
        { text: '#111C30', color: '#F472B6' },
        { text: '; ', color: '#CBD5E1' },
        { text: 'accent: ', color: '#93C5FD' },
        { text: '#3B82F6', color: '#60A5FA' },
        { text: '; }', color: '#CBD5E1' },
      ],
    },
    { tokens: [] },
    {
      tokens: [
        { text: '// main.js & Hero.tsx · React UI', color: '#64748B' },
      ],
    },
    {
      tokens: [
        { text: 'import ', color: '#C084FC' },
        { text: '{ useState, useEffect } ', color: '#F8FAFC' },
        { text: 'from ', color: '#C084FC' },
        { text: "'react'", color: '#34D399' },
        { text: ';', color: '#CBD5E1' },
      ],
    },
    {
      tokens: [
        { text: 'const ', color: '#C084FC' },
        { text: 'skills ', color: '#60A5FA' },
        { text: '= [', color: '#CBD5E1' },
        { text: "'HTML'", color: '#34D399' },
        { text: ', ', color: '#CBD5E1' },
        { text: "'CSS'", color: '#34D399' },
        { text: ', ', color: '#CBD5E1' },
        { text: "'JS'", color: '#34D399' },
        { text: ', ', color: '#CBD5E1' },
        { text: "'React'", color: '#34D399' },
        { text: '];', color: '#CBD5E1' },
      ],
    },
    { tokens: [] },
    {
      tokens: [
        { text: 'export function ', color: '#C084FC' },
        { text: 'GabrielPortfolio', color: '#FBBF24' },
        { text: '() {', color: '#CBD5E1' },
      ],
    },
    {
      tokens: [
        { text: '  const ', color: '#C084FC' },
        { text: '[active, setActive] ', color: '#F8FAFC' },
        { text: '= ', color: '#CBD5E1' },
        { text: 'useState', color: '#60A5FA' },
        { text: '(', color: '#CBD5E1' },
        { text: 'true', color: '#FB923C' },
        { text: ');', color: '#CBD5E1' },
      ],
    },
    {
      tokens: [
        { text: '  return ', color: '#C084FC' },
        { text: '(', color: '#CBD5E1' },
      ],
    },
    {
      tokens: [
        { text: '    <Hero ', color: '#38BDF8' },
        { text: 'name=', color: '#93C5FD' },
        { text: '"Gabriel Akintoye"', color: '#34D399' },
        { text: ' role=', color: '#93C5FD' },
        { text: '"Web Developer"', color: '#34D399' },
        { text: ' />', color: '#38BDF8' },
      ],
    },
    {
      tokens: [
        { text: '  );', color: '#CBD5E1' },
      ],
    },
    {
      tokens: [
        { text: '}', color: '#CBD5E1' },
      ],
    },
  ];

  const startY = 82;
  const lineHeight = 31;
  codeLines.forEach((line, i) => {
    const y = startY + i * lineHeight;

    if (i === 13) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
      ctx.fillRect(212, y - 20, 800, 28);
    }

    ctx.font = '400 14px "JetBrains Mono", monospace';
    ctx.fillStyle = i === 13 ? '#60A5FA' : '#475569';
    const numStr = String(i + 1).padStart(2, '0');
    ctx.fillText(numStr, 224, y);

    let cursorX = 266;
    ctx.font = '500 15px "JetBrains Mono", monospace';
    line.tokens.forEach((token) => {
      ctx.fillStyle = token.color;
      ctx.fillText(token.text, cursorX, y);
      cursorX += ctx.measureText(token.text).width;
    });

    if (i === 13) {
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(cursorX + 4, y - 16, 8, 20);
    }
  });

  // Bottom Status Bar
  ctx.fillStyle = '#1D4ED8';
  ctx.fillRect(0, 610, 1024, 30);
  ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#F8FAFC';
  ctx.fillText('main*   TypeScript React · HTML · CSS · JS', 18, 630);
  ctx.fillText('UTF-8   Spaces: 2   Ln 14, Col 58', 775, 630);

  ctx.restore();
}

function createCodeEditorTexture(
  maxAnisotropy: number,
  isMobile: boolean
): { texture: THREE.CanvasTexture; canvas: HTMLCanvasElement; scale: number } {
  const scale = isMobile ? 0.75 : 1;
  const canvas = document.createElement('canvas');
  drawCodeEditorCanvas(canvas, scale);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = isMobile ? Math.min(2, maxAnisotropy) : Math.min(8, maxAnisotropy);
  texture.needsUpdate = true;
  return { texture, canvas, scale };
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
    grad.addColorStop(0, 'rgba(59, 130, 246, 0.34)');
    grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.45)');
    grad.addColorStop(1, 'rgba(11, 18, 32, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function Laptop3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let cancelled = false;
    let cleanupScene: (() => void) | null = null;
    let idleHandle: number | undefined;
    let deferTimeout: number | undefined;

    const initScene = () => {
      if (cancelled || !mountRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobileDevice =
        window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

      // Detect software WebGL cleanly without extra permanent contexts
      let isSoftwareGl = false;
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) {
          setFallbackMode(true);
          return;
        }
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {
        setFallbackMode(true);
        return;
      }

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: !isSoftwareGl,
          alpha: true,
          powerPreference: isMobileDevice ? 'default' : 'high-performance',
        });
      } catch {
        setFallbackMode(true);
        return;
      }

      const useShadows = !isSoftwareGl && !isMobileDevice;
      const useHeavyPhysical = !isSoftwareGl && !isMobileDevice;

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setPixelRatio(
        isSoftwareGl
          ? 1
          : isMobileDevice
            ? Math.min(window.devicePixelRatio, 1.25)
            : Math.min(window.devicePixelRatio, 2)
      );
      renderer.shadowMap.enabled = useShadows;
      if (useShadows) {
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }

      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.setAttribute(
        'aria-label',
        'Interactive 3D laptop displaying HTML, CSS, JavaScript, and React code'
      );

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const width = container.clientWidth || 560;
      const height = container.clientHeight || 440;

      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
      const updateCameraForSize = (w: number, h: number) => {
        camera.aspect = w / Math.max(h, 1);
        const aspectFactor = camera.aspect < 1.05 ? 6.4 : 5.35;
        camera.position.set(0, 1.35, aspectFactor);
        camera.lookAt(0, 0.25, 0);
        camera.updateProjectionMatrix();
      };
      updateCameraForSize(width, height);
      renderer.setSize(width, height, false);

      // Studio environment reflection
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
      scene.environment = envTarget.texture;
      roomEnv.dispose();
      pmremGenerator.dispose();

      // Lighting Rig
      const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x0b1220, 0.85);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xf8fafc, 1.85);
      keyLight.position.set(3.5, 5.5, 4.5);
      keyLight.castShadow = useShadows;
      if (useShadows) {
        keyLight.shadow.mapSize.set(1024, 1024);
        keyLight.shadow.camera.near = 1;
        keyLight.shadow.camera.far = 16;
        keyLight.shadow.camera.left = -3;
        keyLight.shadow.camera.right = 3;
        keyLight.shadow.camera.top = 3;
        keyLight.shadow.camera.bottom = -3;
        keyLight.shadow.bias = -0.0005;
      }
      scene.add(keyLight);

      const blueRimLight = new THREE.PointLight(0x3b82f6, 7.5, 14, 1.8);
      blueRimLight.position.set(-3.1, 2.2, -1.8);
      scene.add(blueRimLight);

      const cyanAccentLight = new THREE.PointLight(0x60a5fa, 5.2, 12, 1.8);
      cyanAccentLight.position.set(2.8, -0.4, 2.5);
      scene.add(cyanAccentLight);

      if (useHeavyPhysical) {
        RectAreaLightUniformsLib.init();
        const rectAreaLight = new THREE.RectAreaLight(0x93c5fd, 2.2, 3.2, 1.8);
        rectAreaLight.position.set(1.8, 2.6, 2.8);
        rectAreaLight.lookAt(0, 0.5, 0);
        scene.add(rectAreaLight);
      }

      // Track disposable resources
      const geometries: THREE.BufferGeometry[] = [];
      const materials: THREE.Material[] = [];
      const textures: THREE.Texture[] = [];

      const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
        geometries.push(g);
        return g;
      };
      const trackMat = <T extends THREE.Material>(m: T): T => {
        materials.push(m);
        return m;
      };

      // Adaptive PBR Materials (Standard on mobile, Physical clearcoat/anisotropy on desktop GPU)
      const aluminumMat = trackMat(
        useHeavyPhysical
          ? new THREE.MeshPhysicalMaterial({
              color: 0x26344d,
              metalness: 0.88,
              roughness: 0.23,
              anisotropy: 0.7,
              clearcoat: 0.15,
              clearcoatRoughness: 0.3,
            })
          : new THREE.MeshStandardMaterial({
              color: 0x26344d,
              metalness: 0.88,
              roughness: 0.23,
            })
      );

      const darkTrimMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.45,
          roughness: 0.55,
        })
      );

      const hingeMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x475569,
          metalness: 0.92,
          roughness: 0.18,
        })
      );

      const keyboardBacklightMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x1e40af,
          emissive: 0x3b82f6,
          emissiveIntensity: 0.5,
          roughness: 0.4,
        })
      );

      const keycapMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x111a2e,
          metalness: 0.2,
          roughness: 0.48,
        })
      );

      const trackpadMat = trackMat(
        useHeavyPhysical
          ? new THREE.MeshPhysicalMaterial({
              color: 0x162238,
              metalness: 0.25,
              roughness: 0.09,
              clearcoat: 1.0,
              clearcoatRoughness: 0.08,
            })
          : new THREE.MeshStandardMaterial({
              color: 0x162238,
              metalness: 0.35,
              roughness: 0.14,
            })
      );

      const bezelGlassMat = trackMat(
        useHeavyPhysical
          ? new THREE.MeshPhysicalMaterial({
              color: 0x050912,
              metalness: 0.1,
              roughness: 0.06,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
            })
          : new THREE.MeshStandardMaterial({
              color: 0x050912,
              metalness: 0.18,
              roughness: 0.12,
            })
      );

      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      const { texture: screenTex, canvas: screenCanvas, scale: screenScale } =
        createCodeEditorTexture(maxAniso, isMobileDevice);
      textures.push(screenTex);

      const screenMat = trackMat(
        new THREE.MeshStandardMaterial({
          map: screenTex,
          emissiveMap: screenTex,
          emissive: 0xffffff,
          emissiveIntensity: 0.92,
          roughness: 0.2,
          metalness: 0.05,
        })
      );

      const glassReflectionMat = trackMat(
        useHeavyPhysical
          ? new THREE.MeshPhysicalMaterial({
              color: 0xdbeafe,
              metalness: 0,
              roughness: 0.04,
              clearcoat: 1.0,
              clearcoatRoughness: 0.03,
              transparent: true,
              opacity: 0.12,
              depthWrite: false,
            })
          : new THREE.MeshStandardMaterial({
              color: 0xdbeafe,
              metalness: 0.1,
              roughness: 0.08,
              transparent: true,
              opacity: 0.09,
              depthWrite: false,
            })
      );

      const shadowTex = createContactShadowTexture();
      textures.push(shadowTex);
      const shadowMat = trackMat(
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
        })
      );

      // Build Composite Laptop Group
      const laptopRoot = new THREE.Group();
      scene.add(laptopRoot);

      const laptopWidth = 3.05;
      const laptopDepth = 2.05;
      const baseHeight = 0.085;
      const curveSegments = isMobileDevice ? 6 : 12;
      const bevelSegments = isMobileDevice ? 2 : 3;

      // 1. Lower Chassis Base
      const baseShape = createRoundedRectShape(laptopWidth, laptopDepth, 0.11);
      const baseGeo = trackGeo(
        new THREE.ExtrudeGeometry(baseShape, {
          depth: baseHeight,
          curveSegments,
          bevelEnabled: true,
          bevelThickness: 0.015,
          bevelSize: 0.015,
          bevelSegments,
        })
      );
      baseGeo.rotateX(Math.PI / 2);
      const baseMesh = new THREE.Mesh(baseGeo, aluminumMat);
      baseMesh.position.y = 0;
      baseMesh.castShadow = useShadows;
      baseMesh.receiveShadow = useShadows;
      laptopRoot.add(baseMesh);

      // 2. Recessed Keyboard Well + Subtle Blue Underglow
      const kbWellGeo = trackGeo(new THREE.BoxGeometry(2.58, 0.012, 0.96));
      const kbWellMesh = new THREE.Mesh(kbWellGeo, darkTrimMat);
      kbWellMesh.position.set(0, 0.012, -0.24);
      laptopRoot.add(kbWellMesh);

      const kbGlowGeo = trackGeo(new THREE.PlaneGeometry(2.52, 0.9));
      kbGlowGeo.rotateX(-Math.PI / 2);
      const kbGlowMesh = new THREE.Mesh(kbGlowGeo, keyboardBacklightMat);
      kbGlowMesh.position.set(0, 0.019, -0.24);
      laptopRoot.add(kbGlowMesh);

      // 3. Instanced Keycaps Grid (62 keys in 5 rows)
      const keyGeo = trackGeo(new THREE.BoxGeometry(1, 0.018, 1));
      const rowConfigs = [
        { z: -0.60, cols: 14, width: 0.155, gap: 0.021, keyDepth: 0.145 },
        { z: -0.42, cols: 14, width: 0.155, gap: 0.021, keyDepth: 0.145 },
        { z: -0.24, cols: 13, width: 0.168, gap: 0.022, keyDepth: 0.145 },
        { z: -0.06, cols: 12, width: 0.184, gap: 0.022, keyDepth: 0.145 },
        { z: 0.12, cols: 9, width: 0.165, gap: 0.024, keyDepth: 0.145 },
      ];
      const totalKeys = rowConfigs.reduce((acc, r) => acc + r.cols, 0);
      const keysInstanced = new THREE.InstancedMesh(keyGeo, keycapMat, totalKeys);
      const dummy = new THREE.Object3D();
      let keyIndex = 0;

      rowConfigs.forEach((row, rIdx) => {
        const totalRowSpan = row.cols * row.width + (row.cols - 1) * row.gap;
        const startX = -totalRowSpan / 2 + row.width / 2;

        for (let c = 0; c < row.cols; c++) {
          const kx = startX + c * (row.width + row.gap);
          let kw = row.width;
          if (rIdx === 4 && c === 4) {
            kw = row.width * 2.5;
          }
          dummy.position.set(kx, 0.026, row.z);
          dummy.scale.set(kw, 1, row.keyDepth);
          dummy.updateMatrix();
          keysInstanced.setMatrixAt(keyIndex++, dummy.matrix);
        }
      });
      keysInstanced.instanceMatrix.needsUpdate = true;
      keysInstanced.computeBoundingSphere();
      laptopRoot.add(keysInstanced);

      // 4. Precision Glass Trackpad
      const trackpadGeo = trackGeo(new THREE.BoxGeometry(1.06, 0.008, 0.62));
      const trackpadMesh = new THREE.Mesh(trackpadGeo, trackpadMat);
      trackpadMesh.position.set(0, 0.015, 0.61);
      laptopRoot.add(trackpadMesh);

      // 5. Rear Hinge Barrel
      const hingeGeo = trackGeo(
        new THREE.CylinderGeometry(0.038, 0.038, 2.25, isMobileDevice ? 12 : 20)
      );
      hingeGeo.rotateZ(Math.PI / 2);
      const hingeMesh = new THREE.Mesh(hingeGeo, hingeMat);
      hingeMesh.position.set(0, 0.02, -laptopDepth / 2 + 0.02);
      laptopRoot.add(hingeMesh);

      // 6. Upper Display Lid Group (Pivoted at Hinge)
      const lidPivot = new THREE.Group();
      lidPivot.position.set(0, 0.025, -laptopDepth / 2 + 0.02);
      lidPivot.rotation.x = -0.34;
      laptopRoot.add(lidPivot);

      const lidHeight = 1.98;
      const lidShape = createRoundedRectShape(laptopWidth, lidHeight, 0.11);
      const lidGeo = trackGeo(
        new THREE.ExtrudeGeometry(lidShape, {
          depth: 0.045,
          curveSegments,
          bevelEnabled: true,
          bevelThickness: 0.012,
          bevelSize: 0.012,
          bevelSegments,
        })
      );
      const lidShell = new THREE.Mesh(lidGeo, aluminumMat);
      lidShell.position.set(0, lidHeight / 2, -0.045);
      lidShell.castShadow = useShadows;
      lidPivot.add(lidShell);

      // Front Glass Bezel
      const bezelShape = createRoundedRectShape(laptopWidth - 0.08, lidHeight - 0.08, 0.08);
      const bezelGeo = trackGeo(new THREE.ShapeGeometry(bezelShape, curveSegments));
      const bezelMesh = new THREE.Mesh(bezelGeo, bezelGlassMat);
      bezelMesh.position.set(0, lidHeight / 2, 0.013);
      lidPivot.add(bezelMesh);

      // Glowing Code Editor Screen
      const screenW = 2.82;
      const screenH = 1.76;
      const screenGeo = trackGeo(new THREE.PlaneGeometry(screenW, screenH));
      const screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, lidHeight / 2 + 0.01, 0.016);
      lidPivot.add(screenMesh);

      // Subtle Outer Glass Reflection Overlay
      const glassOverlayGeo = trackGeo(new THREE.PlaneGeometry(screenW + 0.04, screenH + 0.04));
      const glassOverlayMesh = new THREE.Mesh(glassOverlayGeo, glassReflectionMat);
      glassOverlayMesh.position.set(0, lidHeight / 2 + 0.01, 0.02);
      glassOverlayMesh.renderOrder = 2;
      lidPivot.add(glassOverlayMesh);

      // Webcam Indicator Dot
      const camGeo = trackGeo(new THREE.CircleGeometry(0.018, 12));
      const camMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
      const camMesh = new THREE.Mesh(camGeo, camMat);
      camMesh.position.set(0, lidHeight - 0.065, 0.018);
      lidPivot.add(camMesh);

      // Contact Ground Glow Plane beneath Laptop
      const shadowPlaneGeo = trackGeo(new THREE.PlaneGeometry(4.4, 3.3));
      shadowPlaneGeo.rotateX(-Math.PI / 2);
      const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
      shadowPlane.position.set(0, -0.58, 0.1);
      scene.add(shadowPlane);

      // Initial Pose
      laptopRoot.rotation.set(0.14, -0.36, 0.03);
      laptopRoot.position.set(0, -0.15, 0);

      // Pre-compile shaders only on desktop hardware GPU
      if (useHeavyPhysical) {
        renderer.compile(scene, camera);
      }

      // Redraw screen texture once non-blocking web fonts (JetBrains Mono) finish loading
      let disposed = false;
      const refreshScreenTexture = () => {
        if (disposed) return;
        drawCodeEditorCanvas(screenCanvas, screenScale);
        screenTex.needsUpdate = true;
        if (prefersReducedMotion || !isLoopRunning) {
          renderer.render(scene, camera);
        }
      };

      const fontSet = document.fonts;
      const handleFontsLoaded = () => refreshScreenTexture();
      if (fontSet) {
        fontSet.addEventListener?.('loadingdone', handleFontsLoaded);
        void fontSet.load('500 15px "JetBrains Mono"').then(refreshScreenTexture).catch(() => {});
        void fontSet.ready.then(refreshScreenTexture);
      }

      // Mouse-following target state (desktop only)
      let targetMouseX = 0;
      let targetMouseY = 0;
      let smoothMouseX = 0;
      let smoothMouseY = 0;

      const handlePointerMove = (e: PointerEvent) => {
        if (prefersReducedMotion || isMobileDevice || e.pointerType === 'touch') return;
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener('pointermove', handlePointerMove, { passive: true });

      // Resize Observer
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          const h = entry.contentRect.height;
          if (w > 0 && h > 0) {
            updateCameraForSize(w, h);
            renderer.setSize(w, h, false);
          }
        }
      });
      resizeObserver.observe(container);

      // Context loss safety
      const handleContextLost = (e: Event) => {
        e.preventDefault();
        setFallbackMode(true);
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

      // Animation Loop with Viewport + Tab Visibility Pacing
      const clock = new THREE.Clock();
      let frameId = 0;
      let isInViewport = true;
      let isTabVisible = !document.hidden;
      let isLoopRunning = false;

      function afterDraw(cb: () => void) {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (!gl || !gl.fenceSync) {
          frameId = window.setTimeout(cb, 80);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed || !isInViewport || !isTabVisible) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      }

      const stopLoop = () => {
        isLoopRunning = false;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
      };

      const startLoop = () => {
        if (disposed || isLoopRunning || !isInViewport || !isTabVisible) return;
        isLoopRunning = true;
        clock.getDelta(); // discard paused time delta so float doesn't jump
        tick();
      };

      const tick = () => {
        if (disposed || !isInViewport || !isTabVisible) {
          isLoopRunning = false;
          return;
        }

        const delta = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.getElapsedTime();

        if (!prefersReducedMotion) {
          smoothMouseX = THREE.MathUtils.damp(smoothMouseX, targetMouseX, 4.5, delta);
          smoothMouseY = THREE.MathUtils.damp(smoothMouseY, targetMouseY, 4.5, delta);

          laptopRoot.position.y = -0.15 + Math.sin(elapsed * 1.15) * 0.075;
          laptopRoot.rotation.y =
            -0.34 + Math.sin(elapsed * 0.45) * 0.14 + smoothMouseX * 0.22;
          laptopRoot.rotation.x =
            0.14 + Math.cos(elapsed * 0.55) * 0.03 + smoothMouseY * 0.12;
          laptopRoot.rotation.z = 0.02 - smoothMouseX * 0.04;

          const floatScale = 1 - Math.sin(elapsed * 1.15) * 0.04;
          shadowPlane.scale.set(floatScale, floatScale, 1);
        }

        renderer.render(scene, camera);

        if (prefersReducedMotion) {
          isLoopRunning = false;
          return;
        }

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      };

      const handleVisibilityChange = () => {
        isTabVisible = !document.hidden;
        if (isTabVisible && isInViewport) {
          startLoop();
        } else {
          stopLoop();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isInViewport = entry.isIntersecting;
          if (isInViewport && isTabVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.02 }
      );
      intersectionObserver.observe(container);

      startLoop();

      cleanupScene = () => {
        disposed = true;
        stopLoop();
        fontSet?.removeEventListener?.('loadingdone', handleFontsLoaded);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        intersectionObserver.disconnect();
        window.removeEventListener('pointermove', handlePointerMove);
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
        textures.forEach((t) => t.dispose());
        envTarget.dispose();
        renderer.dispose();
      };
    };

    // Defer 3D initialization until browser is idle after initial frame
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (win.requestIdleCallback) {
      idleHandle = win.requestIdleCallback(initScene, { timeout: 250 });
    } else {
      deferTimeout = window.setTimeout(initScene, 60);
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) {
        win.cancelIdleCallback?.(idleHandle);
      }
      if (deferTimeout !== undefined) {
        window.clearTimeout(deferTimeout);
      }
      cleanupScene?.();
    };
  }, []);

  if (fallbackMode) {
    return (
      <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-[#1E3A5F]/60 bg-[#0D1729] p-6">
        <div className="w-full max-w-md rounded-xl border border-[#3B82F6]/30 bg-[#070E1A] p-4 shadow-[0_0_50px_rgba(59,130,246,0.18)]">
          <div className="mb-3 flex items-center gap-2 border-b border-[#1E293B] pb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-xs text-[#A1AAB8]">Hero.tsx</span>
          </div>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[#CBD5E1]">
            <code>
              <span className="text-purple-400">const</span>{' '}
              <span className="text-sky-400">stack</span> = [
              <span className="text-emerald-400">&apos;HTML&apos;</span>,{' '}
              <span className="text-emerald-400">&apos;CSS&apos;</span>,{' '}
              <span className="text-emerald-400">&apos;JS&apos;</span>,{' '}
              <span className="text-emerald-400">&apos;React&apos;</span>];
              {'\n'}
              <span className="text-purple-400">export default function</span>{' '}
              <span className="text-amber-300">Portfolio</span>() {'{'}
              {'\n  '}
              <span className="text-purple-400">return</span> &lt;
              <span className="text-sky-400">Developer</span> name=
              <span className="text-emerald-400">&quot;Gabriel Akintoye&quot;</span> /&gt;;
              {'\n'}
              {'}'}
            </code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full min-h-[290px] sm:min-h-[360px] lg:min-h-[460px]">
      {/* Electric-blue ambient lighting behind the 3D laptop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-full bg-radial from-[#3B82F6]/25 via-[#2563EB]/10 to-transparent blur-3xl"
      />
      <div
        ref={mountRef}
        className="relative z-10 h-full w-full"
      />
    </div>
  );
}
