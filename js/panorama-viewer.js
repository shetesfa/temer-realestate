/**
 * TEMER Real Estate — 360-Degree Panoramic Property Viewer
 * High-definition spherical panorama viewer powered by Three.js
 */

(function () {
  let scene, camera, renderer;
  let container, canvas;
  let sphereMesh;
  let isUserInteracting = false;
  let onPointerDownMouseX = 0, onPointerDownMouseY = 0;
  let lon = 0, onPointerDownLon = 0;
  let lat = 0, onPointerDownLat = 0;
  let phi = 0, theta = 0;
  let isAutoPanning = true;

  window.initPanoramaViewer = function (options = {}) {
    container = document.getElementById(options.containerId || 'panorama-viewer-container');
    canvas = document.getElementById(options.canvasId || 'panorama-canvas');
    if (!container || !canvas || !window.THREE) return;

    // Check if device supports WebGL
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    } catch (e) {
      container.innerHTML = `
        <div style="padding:40px; text-align:center; color:var(--text-secondary);">
          <p>360° WebGL Panorama is not supported on this browser or device.</p>
        </div>
      `;
      return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Inverted Sphere Geometry for 360 Environment
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // Procedural Panorama Interior Texture Canvas
    // Generates a luxury architectural penthouse lounge panorama texture
    const textureCanvas = createProceduralInteriorPanorama();
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);

    // Interaction Listeners
    container.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onDocumentMouseWheel, { passive: true });
    window.addEventListener('resize', onResize);

    // HUD controls
    const btnAuto = document.getElementById('pano-btn-autopan');
    const btnFull = document.getElementById('pano-btn-fullscreen');

    btnAuto?.addEventListener('click', () => {
      isAutoPanning = !isAutoPanning;
      btnAuto.classList.toggle('active', isAutoPanning);
    });

    btnFull?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => console.warn(err));
      } else {
        document.exitFullscreen().catch(err => console.warn(err));
      }
    });

    animate();
  };

  function createProceduralInteriorPanorama() {
    const w = 2048, h = 1024;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');

    // Sky & ceiling gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#0c111a');
    skyGrad.addColorStop(0.3, '#1c2436');
    skyGrad.addColorStop(0.5, '#44516d');
    skyGrad.addColorStop(0.52, '#2b231d');
    skyGrad.addColorStop(1, '#0e0c0b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Floor grid (parquetry)
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(0, h * 0.52, w, h * 0.48);

    // Architectural floor-to-ceiling glass windows overlooking Addis Ababa
    ctx.fillStyle = '#bad4ee';
    for (let x = 100; x < w; x += 320) {
      // Window opening
      ctx.fillStyle = 'rgba(160, 190, 225, 0.4)';
      ctx.fillRect(x, h * 0.2, 260, h * 0.32);

      // Mullion columns
      ctx.fillStyle = '#141820';
      ctx.fillRect(x - 10, h * 0.18, 14, h * 0.35);

      // Addis Ababa Mountain skyline silhouette through glass
      ctx.fillStyle = 'rgba(30, 40, 58, 0.7)';
      ctx.beginPath();
      ctx.moveTo(x, h * 0.45);
      ctx.lineTo(x + 70, h * 0.4);
      ctx.lineTo(x + 150, h * 0.43);
      ctx.lineTo(x + 260, h * 0.38);
      ctx.lineTo(x + 260, h * 0.52);
      ctx.lineTo(x, h * 0.52);
      ctx.fill();
    }

    // Warm architectural recessed ceiling lighting
    ctx.fillStyle = 'rgba(240, 200, 130, 0.8)';
    for (let x = 60; x < w; x += 180) {
      ctx.beginPath();
      ctx.arc(x, h * 0.12, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Luxury interior lounge label watermark
    ctx.fillStyle = 'rgba(197, 160, 89, 0.75)';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('TEMER RESIDENCES — 360° INTERIOR VISUALIZATION CONCEPT', 80, h * 0.85);

    return c;
  }

  function onPointerDown(event) {
    if (event.isPrimary === false) return;
    isUserInteracting = true;
    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
  }

  function onPointerMove(event) {
    if (event.isPrimary === false) return;
    if (isUserInteracting === true) {
      lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    }
  }

  function onPointerUp(event) {
    if (event.isPrimary === false) return;
    isUserInteracting = false;
  }

  function onDocumentMouseWheel(event) {
    const fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.MathUtils.clamp(fov, 30, 90);
    camera.updateProjectionMatrix();
  }

  function onResize() {
    if (!container || !camera || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (isAutoPanning && !isUserInteracting) {
      lon += 0.08;
    }

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(x, y, z);
    renderer.render(scene, camera);
  }
})();
