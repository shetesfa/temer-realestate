/**
 * TEMER Real Estate — Dedicated 3D Property Explorer
 * Full-screen architectural unit inspection HUD & floor navigation
 */

(function () {
  let scene, camera, renderer, controls;
  let canvas, container;
  let currentLighting = 'day'; // day, dusk, night
  let currentMode = 'realistic'; // realistic, clay, wireframe
  let autoRotate = false;
  let buildingGroup;
  let dirLight, hemiLight, ambientLight;

  // Floor and Unit data
  const floorData = {
    all: {
      name: "Full Architectural View",
      level: "Ground to 17th Floor",
      units: [
        { id: "all-view", title: "Complete Building Overview", type: "Whole Development", beds: "1, 2, 3 Bed & Penthouses", size: "78 – 285 m²", price: "From 11.5M ETB ($90k USD)", status: "Active Selling / Delivered Units", desc: "Select a specific floor level on the left to inspect floor plans and individual unit specifications." }
      ]
    },
    penthouse: {
      name: "Top Penthouse Duplexes",
      level: "Floors 16 & 17",
      camTarget: { x: 0, y: 26, z: 0 },
      camPos: { x: 20, y: 32, z: 24 },
      units: [
        { id: "ph-1", title: "Sky Penthouse A (Duplex)", type: "Penthouse", beds: "4 Bedrooms + Maid", size: "285 m²", price: "32,000,000 ETB ($250k USD)", status: "Available", desc: "Flagship duplex penthouse featuring double-height glass salon, 65 m² private rooftop terrace, panoramic city vistas, and dedicated service suite." },
        { id: "ph-2", title: "Sky Penthouse B (East Terrace)", type: "Penthouse", beds: "3 Bedrooms + Study", size: "230 m²", price: "26,500,000 ETB ($205k USD)", status: "Reserved", desc: "East-facing morning light penthouse with wrap-around balcony overlooking Bole skyline." }
      ]
    },
    upper: {
      name: "Upper Executive Residences",
      level: "Floors 11 to 15",
      camTarget: { x: 0, y: 20, z: 0 },
      camPos: { x: 22, y: 24, z: 26 },
      units: [
        { id: "up-3b", title: "Unit 14-A (3-Bedroom Sky View)", type: "Apartment", beds: "3 Bedrooms / 3 Baths", size: "168 m²", price: "18,500,000 ETB ($145k USD)", status: "Available", desc: "Spacious master en-suite, expansive sunset terrace, open-concept kitchen, and high-speed elevator access." },
        { id: "up-2b", title: "Unit 12-B (2-Bedroom Deluxe)", type: "Apartment", beds: "2 Bedrooms / 2 Baths", size: "124 m²", price: "14,200,000 ETB ($112k USD)", status: "Available", desc: "Generous layout with floor-to-ceiling windows and acoustic sound-insulated glazing." }
      ]
    },
    mid: {
      name: "Mid Tower Residential Units",
      level: "Floors 5 to 10",
      camTarget: { x: 0, y: 13, z: 0 },
      camPos: { x: 22, y: 16, z: 26 },
      units: [
        { id: "mid-2a", title: "Unit 08-A (2-Bedroom Standard)", type: "Apartment", beds: "2 Bedrooms / 2 Baths", size: "115 m²", price: "12,900,000 ETB ($102k USD)", status: "Available", desc: "Efficient architectural layout designed for modern urban professionals and high rental yield." },
        { id: "mid-1a", title: "Unit 07-C (1-Bedroom Executive)", type: "Apartment", beds: "1 Bedroom / 1 Bath", size: "78 m²", price: "9,200,000 ETB ($72k USD)", status: "Reserved", desc: "Ideal entry investment for diaspora seeking premier central Addis location with turnkey management." }
      ]
    },
    podium: {
      name: "Podium & Commercial Retail",
      level: "Ground to 4th Floor",
      camTarget: { x: 0, y: 3, z: 0 },
      camPos: { x: 18, y: 6, z: 22 },
      units: [
        { id: "pod-c1", title: "Retail Unit G-01 (Commercial Boulevard)", type: "Commercial", beds: "Open Commercial Space", size: "180 m²", price: "Inquire with TEMER Commercial Team", status: "Available", desc: "Double-height street frontage ideal for premier bank branches, luxury boutiques, or international cafes." },
        { id: "pod-m1", title: "Mezzanine Office Suite M-03", type: "Commercial Office", beds: "Executive Office Suite", size: "140 m²", price: "Inquire with TEMER Commercial Team", status: "Available", desc: "Dedicated corporate office floor with elevator lobby and client reception." }
      ]
    }
  };

  let activeFloor = 'all';
  let activeUnit = floorData.all.units[0];

  window.init3DExplorer = function () {
    canvas = document.getElementById('explorer-canvas');
    container = document.querySelector('.explorer-canvas-area');
    if (!canvas || !container || !window.THREE) return;

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06070a);
    scene.fog = new THREE.FogExp2(0x06070a, 0.01);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(40, aspect, 0.5, 400);
    camera.position.set(34, 24, 38);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 4. Controls
    if (window.THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.02;
      controls.minDistance = 12;
      controls.maxDistance = 110;
      controls.target.set(0, 12, 0);
    }

    // 5. Lighting
    setupLighting();

    // 6. Build Procedural Architecture
    buildEnvironment();
    buildBuilding();

    // 7. Event Handlers & UI Setup
    window.addEventListener('resize', onResize);
    setupHUD();
    setupFloorSelector();
    updateSidebar(activeFloor, activeUnit);

    // Render loop
    animate();
  };

  function setupLighting() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    hemiLight = new THREE.HemisphereLight(0xbad2e8, 0x1f232b, 0.55);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    dirLight = new THREE.DirectionalLight(0xfff4e6, 1.4);
    dirLight.position.set(40, 50, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    const d = 35;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);
  }

  function buildEnvironment() {
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0f131a, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Decorative grid rings
    const gridHelper = new THREE.GridHelper(100, 50, 0xc5a059, 0x181f2b);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);
  }

  function buildBuilding() {
    buildingGroup = new THREE.Group();

    const matWhite = new THREE.MeshStandardMaterial({ color: 0xf0eeeb, roughness: 0.35 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.4 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x243e56, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.8 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xc5a059, roughness: 0.3, metalness: 0.6 });

    // Podium
    const podGeo = new THREE.BoxGeometry(16, 4.5, 14);
    const podium = new THREE.Mesh(podGeo, matDark);
    podium.position.set(0, 2.25, 0);
    podium.castShadow = true;
    podium.receiveShadow = true;
    buildingGroup.add(podium);

    // Entrance canopy
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 4), matGold);
    canopy.position.set(0, 3.8, 8.5);
    buildingGroup.add(canopy);

    // Main Tower (14 floors)
    const floors = 14;
    const floorH = 1.6;
    const towerCore = new THREE.Mesh(new THREE.BoxGeometry(13.6, floors * floorH, 11.6), matWhite);
    towerCore.position.set(0, 4.5 + (floors * floorH) / 2, 0);
    towerCore.castShadow = true;
    towerCore.receiveShadow = true;
    buildingGroup.add(towerCore);

    // Slabs & Balconies
    for (let i = 0; i < floors; i++) {
      const y = 4.5 + i * floorH;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.15, 12.2), matDark);
      slab.position.set(0, y, 0);
      buildingGroup.add(slab);

      // Glass windows
      const win = new THREE.Mesh(new THREE.BoxGeometry(12, 1.0, 0.1), matGlass);
      win.position.set(0, y + 0.8, 5.86);
      buildingGroup.add(win);

      const balc = new THREE.Mesh(new THREE.BoxGeometry(4, 0.7, 1.4), matGlass);
      balc.position.set(3.8, y + 0.45, 6.5);
      buildingGroup.add(balc);
    }

    // Penthouse
    const phY = 4.5 + floors * floorH;
    const ph = new THREE.Mesh(new THREE.BoxGeometry(11, 2.8, 9.4), matDark);
    ph.position.set(0, phY + 1.4, 0);
    buildingGroup.add(ph);

    // Roof Crown
    const crown = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 12.4), matGold);
    crown.position.set(0, phY + 3.0, 0);
    buildingGroup.add(crown);

    // TEMER Sign
    const sign = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.2, 0.2), new THREE.MeshStandardMaterial({
      color: 0x1d7b4d,
      emissive: 0x1d7b4d,
      emissiveIntensity: 0.6
    }));
    sign.position.set(0, phY + 2.0, 4.8);
    buildingGroup.add(sign);

    scene.add(buildingGroup);
  }

  function setupHUD() {
    // Lighting
    const btnDay = document.getElementById('hud-light-day');
    const btnDusk = document.getElementById('hud-light-dusk');
    const btnNight = document.getElementById('hud-light-night');

    btnDay?.addEventListener('click', () => setLightingMode('day'));
    btnDusk?.addEventListener('click', () => setLightingMode('dusk'));
    btnNight?.addEventListener('click', () => setLightingMode('night'));

    // Render Mode
    const btnRealistic = document.getElementById('hud-mode-realistic');
    const btnClay = document.getElementById('hud-mode-clay');
    const btnWire = document.getElementById('hud-mode-wire');

    btnRealistic?.addEventListener('click', () => setRenderMode('realistic'));
    btnClay?.addEventListener('click', () => setRenderMode('clay'));
    btnWire?.addEventListener('click', () => setRenderMode('wireframe'));

    // Auto rotate
    const btnRotate = document.getElementById('hud-btn-rotate');
    btnRotate?.addEventListener('click', () => {
      autoRotate = !autoRotate;
      if (controls) controls.autoRotate = autoRotate;
      btnRotate.classList.toggle('active', autoRotate);
    });

    // Reset View
    const btnReset = document.getElementById('hud-btn-reset');
    btnReset?.addEventListener('click', () => {
      animateCameraTo({ x: 34, y: 24, z: 38 }, { x: 0, y: 12, z: 0 });
    });

    // Fullscreen
    const btnFull = document.getElementById('hud-btn-fullscreen');
    btnFull?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => console.warn(e));
      } else {
        document.exitFullscreen().catch(e => console.warn(e));
      }
    });

    // Mobile sidebar toggle
    const toggleSidebar = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.querySelector('.explorer-sidebar');
    toggleSidebar?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
    });
  }

  function setLightingMode(mode) {
    currentLighting = mode;
    document.querySelectorAll('[id^="hud-light-"]').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`hud-light-${mode}`)?.classList.add('active');

    if (mode === 'day') {
      scene.background.set(0x0a0d14);
      scene.fog.color.set(0x0a0d14);
      ambientLight.color.set(0xffffff);
      ambientLight.intensity = 0.5;
      dirLight.color.set(0xfff4e6);
      dirLight.intensity = 1.4;
    } else if (mode === 'dusk') {
      scene.background.set(0x191016);
      scene.fog.color.set(0x191016);
      ambientLight.color.set(0xdda088);
      ambientLight.intensity = 0.35;
      dirLight.color.set(0xff8844);
      dirLight.intensity = 1.1;
    } else if (mode === 'night') {
      scene.background.set(0x040508);
      scene.fog.color.set(0x040508);
      ambientLight.color.set(0x334466);
      ambientLight.intensity = 0.2;
      dirLight.color.set(0x6688aa);
      dirLight.intensity = 0.35;
    }
  }

  function setRenderMode(mode) {
    currentMode = mode;
    document.querySelectorAll('[id^="hud-mode-"]').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`hud-mode-${mode === 'wireframe' ? 'wire' : mode}`)?.classList.add('active');

    buildingGroup.traverse(child => {
      if (child.isMesh && child.material) {
        if (mode === 'wireframe') {
          child.material.wireframe = true;
        } else if (mode === 'clay') {
          child.material.wireframe = false;
          child.material.roughness = 0.95;
          child.material.metalness = 0.0;
        } else {
          child.material.wireframe = false;
        }
      }
    });
  }

  function setupFloorSelector() {
    const buttons = document.querySelectorAll('.floor-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const floorKey = btn.getAttribute('data-floor');
        if (floorData[floorKey]) {
          activeFloor = floorKey;
          activeUnit = floorData[floorKey].units[0];
          updateSidebar(floorKey, activeUnit);

          if (floorData[floorKey].camPos && floorData[floorKey].camTarget) {
            animateCameraTo(floorData[floorKey].camPos, floorData[floorKey].camTarget);
          } else {
            animateCameraTo({ x: 34, y: 24, z: 38 }, { x: 0, y: 12, z: 0 });
          }
        }
      });
    });
  }

  function updateSidebar(floorKey, unit) {
    const titleEl = document.getElementById('sidebar-unit-title');
    const badgeEl = document.getElementById('sidebar-unit-badge');
    const specsContainer = document.getElementById('sidebar-unit-specs');
    const descEl = document.getElementById('sidebar-unit-desc');
    const whatsappBtn = document.getElementById('sidebar-unit-whatsapp');

    if (titleEl) titleEl.textContent = unit.title;
    if (badgeEl) badgeEl.textContent = unit.type;
    if (descEl) descEl.textContent = unit.desc;

    if (specsContainer) {
      specsContainer.innerHTML = `
        <div class="unit-spec-row">
          <span class="unit-spec-label">Floor Level</span>
          <span class="unit-spec-val">${floorData[floorKey].level}</span>
        </div>
        <div class="unit-spec-row">
          <span class="unit-spec-label">Bedrooms / Baths</span>
          <span class="unit-spec-val">${unit.beds}</span>
        </div>
        <div class="unit-spec-row">
          <span class="unit-spec-label">Internal Area</span>
          <span class="unit-spec-val">${unit.size}</span>
        </div>
        <div class="unit-spec-row">
          <span class="unit-spec-label">Pricing Guide</span>
          <span class="unit-spec-val" style="color:var(--gold-primary); font-weight:700;">${unit.price}</span>
        </div>
        <div class="unit-spec-row">
          <span class="unit-spec-label">Status</span>
          <span class="unit-spec-val" style="color:#2ea069;">${unit.status}</span>
        </div>
      `;
    }

    if (whatsappBtn) {
      const msg = encodeURIComponent(
        `Hello TEMER Real Estate,\n\nI am inquiring about ${unit.title} (${floorData[floorKey].level}) in your 3D Property Explorer.\nSize: ${unit.size}\nGuide: ${unit.price}\nPlease send me the latest floor plan and payment schedule.`
      );
      whatsappBtn.href = `https://wa.me/251941246658?text=${msg}`;
    }
  }

  function animateCameraTo(targetPos, targetLookAt) {
    if (!controls) return;
    const startTime = performance.now();
    const duration = 1200;
    const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const startLook = { x: controls.target.x, y: controls.target.y, z: controls.target.z };

    function step(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);

      camera.position.set(
        startPos.x + (targetPos.x - startPos.x) * ease,
        startPos.y + (targetPos.y - startPos.y) * ease,
        startPos.z + (targetPos.z - startPos.z) * ease
      );
      controls.target.set(
        startLook.x + (targetLookAt.x - startLook.x) * ease,
        startLook.y + (targetLookAt.y - startLook.y) * ease,
        startLook.z + (targetLookAt.z - startLook.z) * ease
      );

      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function onResize() {
    if (!camera || !renderer || !container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
})();
