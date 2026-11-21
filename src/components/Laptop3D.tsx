import { useEffect, useRef, useState } from 'react';
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  Scene,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  Timer,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
  type Texture,
  type WebGLRenderTarget,
} from 'three';

function createRoundedRectShape(width: number, height: number, radius: number): Shape {
  const shape = new Shape();
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
): { texture: CanvasTexture; canvas: HTMLCanvasElement; scale: number } {
  const scale = isMobile ? 0.75 : 1;
  const canvas = document.createElement('canvas');
  drawCodeEditorCanvas(canvas, scale);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = isMobile ? Math.min(2, maxAnisotropy) : Math.min(8, maxAnisotropy);
  texture.needsUpdate = true;
  return { texture, canvas, scale };
}

function createContactShadowTexture(): CanvasTexture {
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
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
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
    let disposed = false;
    let stageRafId = 0;
    let frameId = 0;

    let renderer: WebGLRenderer | null = null;
    let envTarget: WebGLRenderTarget | null = null;
    let timer: Timer | null = null;
    let fontSet: FontFaceSet | undefined;
    let handleFontsLoaded: (() => void) | null = null;
    let handleVisibilityChange: (() => void) | null = null;
    let handlePointerMove: ((e: PointerEvent) => void) | null = null;
    let handleContextLost: ((e: Event) => void) | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const geometries: BufferGeometry[] = [];
    const materials: Material[] = [];
    const textures: Texture[] = [];

    const cleanupResources = () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(stageRafId);
      cancelAnimationFrame(frameId);

      if (timer) {
        timer.disconnect();
        timer.dispose();
        timer = null;
      }
      if (fontSet && handleFontsLoaded) {
        fontSet.removeEventListener?.('loadingdone', handleFontsLoaded);
      }
      if (handleVisibilityChange) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      if (handlePointerMove) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      if (renderer && handleContextLost) {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      }

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTarget?.dispose();
      renderer?.dispose();
      renderer = null;
    };

    const yieldFrame = () =>
      new Promise<void>((resolve) => {
        stageRafId = requestAnimationFrame(() => resolve());
      });

    const initScene = async () => {
      if (cancelled || !mountRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobileDevice =
        window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

      // Stage 1: Measure layout before DOM writes, create single WebGLRenderer, detect software GL
      const initialWidth = container.clientWidth || 560;
      const initialHeight = container.clientHeight || 440;

      let activeRenderer: WebGLRenderer;
      try {
        activeRenderer = new WebGLRenderer({
          antialias: !isMobileDevice,
          alpha: true,
          powerPreference: isMobileDevice ? 'default' : 'high-performance',
        });
      } catch {
        if (!cancelled) setFallbackMode(true);
        return;
      }
      renderer = activeRenderer;

      const gl = activeRenderer.getContext();
      if (!gl) {
        cleanupResources();
        if (!cancelled) setFallbackMode(true);
        return;
      }

      let isSoftwareGl = false;
      try {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        isSoftwareGl = false;
      }

      const hasParallelShaderCompile = Boolean(gl.getExtension('KHR_parallel_shader_compile'));
      const useShadows = !isSoftwareGl && !isMobileDevice;
      const useHeavyPhysical = !isSoftwareGl && !isMobileDevice;

      // Kick off desktop-only RoomEnvironment load concurrently during Stage 1 yield
      const roomEnvModulePromise = useHeavyPhysical
        ? import('three/addons/environments/RoomEnvironment.js')
        : null;

      activeRenderer.outputColorSpace = SRGBColorSpace;
      activeRenderer.toneMapping = ACESFilmicToneMapping;
      activeRenderer.toneMappingExposure = 1.15;
      activeRenderer.setPixelRatio(
        isSoftwareGl
          ? 1
          : isMobileDevice
            ? Math.min(window.devicePixelRatio, 1.25)
            : Math.min(window.devicePixelRatio, 2)
      );
      activeRenderer.shadowMap.enabled = useShadows;
      if (useShadows) {
        activeRenderer.shadowMap.type = PCFSoftShadowMap;
      }

      activeRenderer.domElement.style.width = '100%';
      activeRenderer.domElement.style.height = '100%';
      activeRenderer.domElement.style.display = 'block';
      activeRenderer.domElement.setAttribute('role', 'img');
      activeRenderer.domElement.setAttribute(
        'aria-label',
        'Interactive 3D laptop displaying HTML, CSS, JavaScript, and React code'
      );

      handleContextLost = (e: Event) => {
        e.preventDefault();
        if (!cancelled) setFallbackMode(true);
      };
      activeRenderer.domElement.addEventListener('webglcontextlost', handleContextLost);

      const camera = new PerspectiveCamera(36, initialWidth / initialHeight, 0.1, 50);
      const updateCameraForSize = (w: number, h: number) => {
        camera.aspect = w / Math.max(h, 1);
        const aspectFactor = camera.aspect < 1.05 ? 6.4 : 5.35;
        camera.position.set(0, 1.35, aspectFactor);
        camera.lookAt(0, 0.25, 0);
        camera.updateProjectionMatrix();
      };
      updateCameraForSize(initialWidth, initialHeight);
      activeRenderer.setSize(initialWidth, initialHeight, false);

      container.innerHTML = '';
      container.appendChild(activeRenderer.domElement);

      await yieldFrame();
      if (cancelled || disposed) {
        cleanupResources();
        return;
      }

      // Stage 2: Scene, Studio Environment (desktop hardware GPU only), and Lighting Rig
      const scene = new Scene();

      if (roomEnvModulePromise) {
        const { RoomEnvironment } = await roomEnvModulePromise;
        if (cancelled || disposed) {
          cleanupResources();
          return;
        }
        const pmremGenerator = new PMREMGenerator(activeRenderer);
        const roomEnv = new RoomEnvironment();
        envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
        scene.environment = envTarget.texture;
        roomEnv.dispose();
        pmremGenerator.dispose();
      }

      const hemiLight = new HemisphereLight(
        0x93c5fd,
        0x0b1220,
        useHeavyPhysical ? 0.85 : 1.32
      );
      scene.add(hemiLight);

      const keyLight = new DirectionalLight(0xf8fafc, useHeavyPhysical ? 1.85 : 2.0);
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

      if (useHeavyPhysical) {
        const blueRimLight = new PointLight(0x3b82f6, 7.5, 14, 1.8);
        blueRimLight.position.set(-3.1, 2.2, -1.8);
        scene.add(blueRimLight);

        const cyanAccentLight = new PointLight(0x60a5fa, 5.2, 12, 1.8);
        cyanAccentLight.position.set(2.8, -0.4, 2.5);
        scene.add(cyanAccentLight);

        const coolFillLight = new DirectionalLight(0x93c5fd, 0.72);
        coolFillLight.position.set(1.8, 2.6, 2.8);
        scene.add(coolFillLight);
      } else if (!isSoftwareGl) {
        // Mobile hardware GPU: keep 1 PointLight rim + lightweight fill
        const blueRimLight = new PointLight(0x3b82f6, 6.8, 14, 1.8);
        blueRimLight.position.set(-3.1, 2.2, -1.8);
        scene.add(blueRimLight);

        const coolFillLight = new DirectionalLight(0x93c5fd, 0.75);
        coolFillLight.position.set(1.8, 2.6, 2.8);
        scene.add(coolFillLight);
      } else {
        // Software WebGL: blue directional rim replaces expensive PointLight distance attenuation loops
        const blueDirectionalRim = new DirectionalLight(0x60a5fa, 0.98);
        blueDirectionalRim.position.set(-2.8, 2.1, -1.5);
        scene.add(blueDirectionalRim);
      }

      await yieldFrame();
      if (cancelled || disposed) {
        cleanupResources();
        return;
      }

      // Stage 3: Textures, Materials, and Laptop Geometry
      const trackGeo = <T extends BufferGeometry>(g: T): T => {
        geometries.push(g);
        return g;
      };
      const trackMat = <T extends Material>(m: T): T => {
        materials.push(m);
        return m;
      };

      // Adaptive materials:
      // - Desktop hardware GPU: MeshPhysicalMaterial (clearcoat/anisotropy)
      // - Mobile hardware GPU: MeshStandardMaterial PBR
      // - Software WebGL: MeshPhongMaterial + shared MeshBasicMaterial to cut LLVM JIT shader compilation
      const aluminumMat = trackMat(
        useHeavyPhysical
          ? new MeshPhysicalMaterial({
              color: 0x26344d,
              metalness: 0.88,
              roughness: 0.23,
              anisotropy: 0.7,
              clearcoat: 0.15,
              clearcoatRoughness: 0.3,
            })
          : isSoftwareGl
            ? new MeshPhongMaterial({
                color: 0x2b3e5d,
                specular: 0x93c5fd,
                shininess: 58,
              })
            : new MeshStandardMaterial({
                color: 0x26344d,
                metalness: 0.88,
                roughness: 0.23,
              })
      );

      const darkTrimMat = trackMat(
        isSoftwareGl
          ? new MeshPhongMaterial({
              color: 0x0f172a,
              specular: 0x334155,
              shininess: 24,
            })
          : new MeshStandardMaterial({
              color: 0x0f172a,
              metalness: 0.45,
              roughness: 0.55,
            })
      );

      const hingeMat = trackMat(
        isSoftwareGl
          ? new MeshPhongMaterial({
              color: 0x475569,
              specular: 0xcbd5e1,
              shininess: 90,
            })
          : new MeshStandardMaterial({
              color: 0x475569,
              metalness: 0.92,
              roughness: 0.18,
            })
      );

      const keyboardBacklightMat = trackMat(
        isSoftwareGl
          ? new MeshBasicMaterial({
              color: 0x2563eb,
            })
          : new MeshStandardMaterial({
              color: 0x1e40af,
              emissive: 0x3b82f6,
              emissiveIntensity: 0.5,
              roughness: 0.4,
            })
      );

      const keycapMat = trackMat(
        isSoftwareGl
          ? new MeshPhongMaterial({
              color: 0x111a2e,
              specular: 0x3b82f6,
              shininess: 30,
            })
          : new MeshStandardMaterial({
              color: 0x111a2e,
              metalness: 0.2,
              roughness: 0.48,
            })
      );

      const trackpadMat = trackMat(
        useHeavyPhysical
          ? new MeshPhysicalMaterial({
              color: 0x162238,
              metalness: 0.25,
              roughness: 0.09,
              clearcoat: 1.0,
              clearcoatRoughness: 0.08,
            })
          : isSoftwareGl
            ? new MeshPhongMaterial({
                color: 0x162238,
                specular: 0x60a5fa,
                shininess: 95,
              })
            : new MeshStandardMaterial({
                color: 0x162238,
                metalness: 0.35,
                roughness: 0.14,
              })
      );

      const bezelGlassMat = trackMat(
        useHeavyPhysical
          ? new MeshPhysicalMaterial({
              color: 0x050912,
              metalness: 0.1,
              roughness: 0.06,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
            })
          : isSoftwareGl
            ? new MeshPhongMaterial({
                color: 0x050912,
                specular: 0x475569,
                shininess: 100,
              })
            : new MeshStandardMaterial({
                color: 0x050912,
                metalness: 0.18,
                roughness: 0.12,
              })
      );

      const maxAniso = activeRenderer.capabilities.getMaxAnisotropy();
      const { texture: screenTex, canvas: screenCanvas, scale: screenScale } =
        createCodeEditorTexture(maxAniso, isMobileDevice);
      textures.push(screenTex);

      const screenMat = trackMat(
        isSoftwareGl
          ? new MeshBasicMaterial({
              map: screenTex,
            })
          : new MeshStandardMaterial({
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
          ? new MeshPhysicalMaterial({
              color: 0xdbeafe,
              metalness: 0,
              roughness: 0.04,
              clearcoat: 1.0,
              clearcoatRoughness: 0.03,
              transparent: true,
              opacity: 0.12,
              depthWrite: false,
            })
          : isSoftwareGl
            ? new MeshBasicMaterial({
                color: 0xdbeafe,
                transparent: true,
                opacity: 0.07,
                depthWrite: false,
              })
            : new MeshStandardMaterial({
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
        new MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          opacity: 0.75,
          depthWrite: false,
        })
      );

      // Build Composite Laptop Group
      const laptopRoot = new Group();
      scene.add(laptopRoot);

      const laptopWidth = 3.05;
      const laptopDepth = 2.05;
      const baseHeight = 0.085;
      const curveSegments = isMobileDevice ? 6 : 12;
      const bevelSegments = isMobileDevice ? 2 : 3;

      // 1. Lower Chassis Base
      const baseShape = createRoundedRectShape(laptopWidth, laptopDepth, 0.11);
      const baseGeo = trackGeo(
        new ExtrudeGeometry(baseShape, {
          depth: baseHeight,
          curveSegments,
          bevelEnabled: true,
          bevelThickness: 0.015,
          bevelSize: 0.015,
          bevelSegments,
        })
      );
      baseGeo.rotateX(Math.PI / 2);
      const baseMesh = new Mesh(baseGeo, aluminumMat);
      baseMesh.position.y = 0;
      baseMesh.castShadow = useShadows;
      baseMesh.receiveShadow = useShadows;
      laptopRoot.add(baseMesh);

      // 2. Recessed Keyboard Well + Subtle Blue Underglow
      const kbWellGeo = trackGeo(new BoxGeometry(2.58, 0.012, 0.96));
      const kbWellMesh = new Mesh(kbWellGeo, darkTrimMat);
      kbWellMesh.position.set(0, 0.012, -0.24);
      laptopRoot.add(kbWellMesh);

      const kbGlowGeo = trackGeo(new PlaneGeometry(2.52, 0.9));
      kbGlowGeo.rotateX(-Math.PI / 2);
      const kbGlowMesh = new Mesh(kbGlowGeo, keyboardBacklightMat);
      kbGlowMesh.position.set(0, 0.019, -0.24);
      laptopRoot.add(kbGlowMesh);

      // 3. Instanced Keycaps Grid (62 keys in 5 rows)
      const keyGeo = trackGeo(new BoxGeometry(1, 0.018, 1));
      const rowConfigs = [
        { z: -0.60, cols: 14, width: 0.155, gap: 0.021, keyDepth: 0.145 },
        { z: -0.42, cols: 14, width: 0.155, gap: 0.021, keyDepth: 0.145 },
        { z: -0.24, cols: 13, width: 0.168, gap: 0.022, keyDepth: 0.145 },
        { z: -0.06, cols: 12, width: 0.184, gap: 0.022, keyDepth: 0.145 },
        { z: 0.12, cols: 9, width: 0.165, gap: 0.024, keyDepth: 0.145 },
      ];
      const totalKeys = rowConfigs.reduce((acc, r) => acc + r.cols, 0);
      const keysInstanced = new InstancedMesh(keyGeo, keycapMat, totalKeys);
      const dummy = new Object3D();
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
      const trackpadGeo = trackGeo(new BoxGeometry(1.06, 0.008, 0.62));
      const trackpadMesh = new Mesh(trackpadGeo, trackpadMat);
      trackpadMesh.position.set(0, 0.015, 0.61);
      laptopRoot.add(trackpadMesh);

      // 5. Rear Hinge Barrel
      const hingeGeo = trackGeo(
        new CylinderGeometry(0.038, 0.038, 2.25, isMobileDevice ? 12 : 20)
      );
      hingeGeo.rotateZ(Math.PI / 2);
      const hingeMesh = new Mesh(hingeGeo, hingeMat);
      hingeMesh.position.set(0, 0.02, -laptopDepth / 2 + 0.02);
      laptopRoot.add(hingeMesh);

      // 6. Upper Display Lid Group (Pivoted at Hinge)
      const lidPivot = new Group();
      lidPivot.position.set(0, 0.025, -laptopDepth / 2 + 0.02);
      lidPivot.rotation.x = -0.34;
      laptopRoot.add(lidPivot);

      const lidHeight = 1.98;
      const lidShape = createRoundedRectShape(laptopWidth, lidHeight, 0.11);
      const lidGeo = trackGeo(
        new ExtrudeGeometry(lidShape, {
          depth: 0.045,
          curveSegments,
          bevelEnabled: true,
          bevelThickness: 0.012,
          bevelSize: 0.012,
          bevelSegments,
        })
      );
      const lidShell = new Mesh(lidGeo, aluminumMat);
      lidShell.position.set(0, lidHeight / 2, -0.045);
      lidShell.castShadow = useShadows;
      lidPivot.add(lidShell);

      // Front Glass Bezel
      const bezelShape = createRoundedRectShape(laptopWidth - 0.08, lidHeight - 0.08, 0.08);
      const bezelGeo = trackGeo(new ShapeGeometry(bezelShape, curveSegments));
      const bezelMesh = new Mesh(bezelGeo, bezelGlassMat);
      bezelMesh.position.set(0, lidHeight / 2, 0.013);
      lidPivot.add(bezelMesh);

      // Glowing Code Editor Screen
      const screenW = 2.82;
      const screenH = 1.76;
      const screenGeo = trackGeo(new PlaneGeometry(screenW, screenH));
      const screenMesh = new Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, lidHeight / 2 + 0.01, 0.016);
      lidPivot.add(screenMesh);

      // Subtle Outer Glass Reflection Overlay
      const glassOverlayGeo = trackGeo(new PlaneGeometry(screenW + 0.04, screenH + 0.04));
      const glassOverlayMesh = new Mesh(glassOverlayGeo, glassReflectionMat);
      glassOverlayMesh.position.set(0, lidHeight / 2 + 0.01, 0.02);
      glassOverlayMesh.renderOrder = 2;
      lidPivot.add(glassOverlayMesh);

      // Webcam Indicator Dot
      const camGeo = trackGeo(new CircleGeometry(0.018, 12));
      const camMat = trackMat(new MeshBasicMaterial({ color: 0x3b82f6 }));
      const camMesh = new Mesh(camGeo, camMat);
      camMesh.position.set(0, lidHeight - 0.065, 0.018);
      lidPivot.add(camMesh);

      // Contact Ground Glow Plane beneath Laptop
      const shadowPlaneGeo = trackGeo(new PlaneGeometry(4.4, 3.3));
      shadowPlaneGeo.rotateX(-Math.PI / 2);
      const shadowPlane = new Mesh(shadowPlaneGeo, shadowMat);
      shadowPlane.position.set(0, -0.58, 0.1);
      scene.add(shadowPlane);

      // Initial Pose
      laptopRoot.rotation.set(0.14, -0.36, 0.03);
      laptopRoot.position.set(0, -0.15, 0);

      await yieldFrame();
      if (cancelled || disposed) {
        cleanupResources();
        return;
      }

      // Stage 4: Compile distinct shader programs asynchronously/per-frame before first render
      const hasCompileAsync = typeof activeRenderer.compileAsync === 'function';
      const shaderBatches = [shadowPlane, camMesh, screenMesh, keysInstanced, baseMesh];

      for (const batch of shaderBatches) {
        if (cancelled || disposed) {
          cleanupResources();
          return;
        }
        if (hasCompileAsync && hasParallelShaderCompile) {
          try {
            await activeRenderer.compileAsync(batch, camera, scene);
          } catch {
            activeRenderer.compile(batch, camera, scene);
          }
        } else {
          activeRenderer.compile(batch, camera, scene);
        }
        await yieldFrame();
      }
      if (cancelled || disposed) {
        cleanupResources();
        return;
      }

      timer = new Timer();
      timer.connect(document);

      let isInViewport = true;
      let isTabVisible = !document.hidden;
      let isLoopRunning = false;
      let hasRenderedInitialFrame = false;

      // Redraw screen texture at most once when JetBrains Mono finishes loading
      fontSet = document.fonts;
      let hasRefreshedFontTexture = Boolean(fontSet?.check?.('500 15px "JetBrains Mono"'));

      const refreshScreenTexture = (force = false) => {
        if (disposed || hasRefreshedFontTexture) return;
        if (!force && fontSet && !fontSet.check('500 15px "JetBrains Mono"')) return;
        hasRefreshedFontTexture = true;
        if (fontSet && handleFontsLoaded) {
          fontSet.removeEventListener?.('loadingdone', handleFontsLoaded);
        }
        drawCodeEditorCanvas(screenCanvas, screenScale);
        screenTex.needsUpdate = true;
        if (!isLoopRunning && isInViewport && isTabVisible) {
          activeRenderer.render(scene, camera);
        }
      };

      handleFontsLoaded = () => refreshScreenTexture(false);
      if (fontSet && !hasRefreshedFontTexture) {
        fontSet.addEventListener?.('loadingdone', handleFontsLoaded);
        void fontSet
          .load('500 15px "JetBrains Mono"')
          .then(() => refreshScreenTexture(true))
          .catch(() => {});
        void fontSet.ready.then(() => refreshScreenTexture(false));
      }

      // Mouse-following target state (desktop hardware GPU only)
      let targetMouseX = 0;
      let targetMouseY = 0;
      let smoothMouseX = 0;
      let smoothMouseY = 0;

      handlePointerMove = (e: PointerEvent) => {
        if (prefersReducedMotion || isMobileDevice || isSoftwareGl || e.pointerType === 'touch') {
          return;
        }
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener('pointermove', handlePointerMove, { passive: true });

      resizeObserver = new ResizeObserver((entries) => {
        if (disposed) return;
        for (const entry of entries) {
          const w = entry.contentRect.width;
          const h = entry.contentRect.height;
          if (w > 0 && h > 0) {
            updateCameraForSize(w, h);
            activeRenderer.setSize(w, h, false);
            if (!isLoopRunning && isInViewport && isTabVisible) {
              activeRenderer.render(scene, camera);
            }
          }
        }
      });
      resizeObserver.observe(container);

      const stopLoop = () => {
        isLoopRunning = false;
        cancelAnimationFrame(frameId);
      };

      const tick = (timestamp?: number) => {
        if (disposed || !isInViewport || !isTabVisible) {
          isLoopRunning = false;
          return;
        }

        if (timer) {
          timer.update(timestamp);
          const delta = Math.min(timer.getDelta(), 0.05);
          const elapsed = timer.getElapsed();

          if (!prefersReducedMotion && !isSoftwareGl) {
            smoothMouseX = MathUtils.damp(smoothMouseX, targetMouseX, 4.5, delta);
            smoothMouseY = MathUtils.damp(smoothMouseY, targetMouseY, 4.5, delta);

            laptopRoot.position.y = -0.15 + Math.sin(elapsed * 1.15) * 0.075;
            laptopRoot.rotation.y =
              -0.34 + Math.sin(elapsed * 0.45) * 0.14 + smoothMouseX * 0.22;
            laptopRoot.rotation.x =
              0.14 + Math.cos(elapsed * 0.55) * 0.03 + smoothMouseY * 0.12;
            laptopRoot.rotation.z = 0.02 - smoothMouseX * 0.04;

            const floatScale = 1 - Math.sin(elapsed * 1.15) * 0.04;
            shadowPlane.scale.set(floatScale, floatScale, 1);
          }
        }

        activeRenderer.render(scene, camera);
        hasRenderedInitialFrame = true;

        // Static posed frame for reduced motion or software WebGL (SwiftShader/llvmpipe)
        if (prefersReducedMotion || isSoftwareGl) {
          isLoopRunning = false;
          return;
        }

        frameId = requestAnimationFrame(tick);
      };

      const startLoop = () => {
        if (disposed || isLoopRunning || !isInViewport || !isTabVisible) return;
        if ((prefersReducedMotion || isSoftwareGl) && hasRenderedInitialFrame) return;
        isLoopRunning = true;
        if (timer) {
          timer.update(); // absorb paused time so float doesn't jump
          timer.getDelta();
        }
        tick();
      };

      handleVisibilityChange = () => {
        isTabVisible = !document.hidden;
        if (isTabVisible && isInViewport) {
          startLoop();
        } else {
          stopLoop();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      intersectionObserver = new IntersectionObserver(
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
    };

    // Hero already defers mounting Laptop3D; start Stage 1 on next animation frame
    stageRafId = requestAnimationFrame(() => {
      if (!cancelled) {
        void initScene();
      }
    });

    return () => {
      cancelled = true;
      cleanupResources();
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
