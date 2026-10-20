/**
 * TEMER Real Estate — Interactive 3D Architecture Scene
 * Powered by Three.js & OrbitControls
 * Procedural Architectural Concept Visualization
 */

(function () {
  let scene, camera, renderer, controls;
  let container, canvas;
  let isNight = false;
  let autoRotate = true;
  let isRendering = false;
  let dirLight, hemiLight, ambientLight;
  let buildingGroup, treeGroup, lampLights = [];
  let hotspots = [];
  let raycaster, mouse;

  const defaultCamPos = { x: 30, y: 22, z: 36 };
  const defaultTarget = { x: 0, y: 12, z: 0 };

  const hotspotData = [
    {
      id: "entrance",
      name: "Grand Lobby & Security Entrance",
      category: "Podium Access",
      position: { x: 0, y: 2.2, z: 8.5 },
      description: "Double-height access-controlled reception lobby with 24/7 security concierge, passenger lifts, and separate service entry."
    },
    {
      id: "balconies",
      name: "Panoramic City Balconies",
      category: "Living Spaces",
      position: { x: 5.6, y: 20, z: 5.8 },
      description: "Deep cantilevered balconies with safety-tempered glass balustrades offering sweeping views of the Addis Ababa skyline."
    },
    {
      id: "windows",
      name: "Double-Glazed Acoustic Glazing",
      category: "Architectural Envelope",
      position: { x: -5.6, y: 15, z: 5.8 },
      description: "High-performance thermal and acoustic double-glazed windows designed for quiet interior comfort and natural light optimization."
    },
    {
      id: "parking",
      name: "Secured Multi-Level Parking",
      category: "Infrastructure",
      position: { x: -14, y: 1.2, z: -2 },
      description: "Dedicated basement and secured surface parking with automated gate access, wide driving ramps, and visitor stalls."
    },
    {
      id: "landscaping",
      name: "Curated Landscaping & Walkways",
      category: "Outdoor Amenities",
      position: { x: 12, y: 1.2, z: 9 },
      description: "Integrated native Ethiopian green gardens, illuminated pedestrian walkways, and relaxing outdoor seating courtyards."
    }
  ];

  window.init3DViewer = function () {
    container = document.getElementById('three-canvas-container');
    canvas = document.getElementById('three-canvas');
    if (!container || !canvas || !window.THREE) return;

    // 1. Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0f16);
    scene.fog = new THREE.FogExp2(0x0c0f16, 0.012);

    // 2. Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(42, aspect, 0.5, 300);
    camera.position.set(defaultCamPos.x, defaultCamPos.y, defaultCamPos.z);

    // 3. Renderer setup
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
    renderer.toneMappingExposure = 1.1;

    // 4. Controls setup
    if (window.THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going underground
      controls.minDistance = 14;
      controls.maxDistance = 80;
      controls.target.set(defaultTarget.x, defaultTarget.y, defaultTarget.z);
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 0.8;
    }

    // 5. Lighting
    setupLighting();

    // 6. Build Procedural Architecture
    buildEnvironment();
    buildArchitecturalTower();
    createHotspots();

    // 7. Raycaster for Hotspots
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // 8. Event Listeners
    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('click', onCanvasClick);
    setupControlsHUD();

    // Hide Loading Indicator
    const loader = document.getElementById('canvas-loader');
    if (loader) {
      loader.classList.add('hidden');
    }

    // 9. Intersection Observer (Pause rendering when offscreen)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isRendering = entry.isIntersecting;
        if (isRendering) {
          animate();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(container);

    isRendering = true;
    animate();
  };

  function setupLighting() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    hemiLight = new THREE.HemisphereLight(0xbad2e8, 0x1f232b, 0.55);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    dirLight = new THREE.DirectionalLight(0xfff4e6, 1.4);
    dirLight.position.set(35, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 120;
    const d = 30;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
  }

  function buildEnvironment() {
    // Ground Plaza
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x141822,
      roughness: 0.85,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Inner Plaza Paving
    const plazaGeo = new THREE.BoxGeometry(44, 0.2, 38);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x242a38,
      roughness: 0.6,
      metalness: 0.15
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(0, 0.1, 2);
    plaza.receiveShadow = true;
    scene.add(plaza);

    // Landscaped Green Planters
    treeGroup = new THREE.Group();
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.9 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2c1d, roughness: 0.9 });

    function addTree(x, z, scale = 1) {
      const tree = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(0.18 * scale, 0.25 * scale, 2.2 * scale, 6);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.1 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliageGeo = new THREE.ConeGeometry(1.6 * scale, 3.8 * scale, 7);
      const foliage = new THREE.Mesh(foliageGeo, greenMat);
      foliage.position.y = (2.2 + 1.8) * scale;
      foliage.castShadow = true;
      tree.add(foliage);

      tree.position.set(x, 0.2, z);
      treeGroup.add(tree);
    }

    addTree(12, 10, 1.2);
    addTree(15, 7, 0.9);
    addTree(14, 13, 1.0);
    addTree(-14, 10, 1.1);
    addTree(-16, 6, 0.85);
    addTree(-15, 14, 1.0);
    addTree(-16, -8, 1.1);
    addTree(16, -8, 1.1);

    scene.add(treeGroup);
  }

  function buildArchitecturalTower() {
    buildingGroup = new THREE.Group();

    // Materials
    const facadeWhite = new THREE.MeshStandardMaterial({
      color: 0xeeece8,
      roughness: 0.35,
      metalness: 0.08
    });
    const facadeDarkAccent = new THREE.MeshStandardMaterial({
      color: 0x222733,
      roughness: 0.45,
      metalness: 0.2
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x2f4b66,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.75
    });
    const goldAccent = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      roughness: 0.3,
      metalness: 0.7
    });

    // 1. Podium Base (Ground & Commercial Mezzanine - 3 floors)
    const podiumGeo = new THREE.BoxGeometry(16, 4.5, 14);
    const podium = new THREE.Mesh(podiumGeo, facadeDarkAccent);
    podium.position.set(0, 2.25, 0);
    podium.castShadow = true;
    podium.receiveShadow = true;
    buildingGroup.add(podium);

    // Podium Glass Storefronts
    const storefrontGeo = new THREE.BoxGeometry(14.5, 3.2, 0.3);
    const storefront = new THREE.Mesh(storefrontGeo, glassMaterial);
    storefront.position.set(0, 2.0, 7.05);
    buildingGroup.add(storefront);

    // Entrance Canopy
    const canopyGeo = new THREE.BoxGeometry(6.5, 0.3, 3.8);
    const canopy = new THREE.Mesh(canopyGeo, goldAccent);
    canopy.position.set(0, 3.8, 8.4);
    canopy.castShadow = true;
    buildingGroup.add(canopy);

    // Entrance Columns
    const colGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.8, 12);
    const colL = new THREE.Mesh(colGeo, facadeDarkAccent);
    colL.position.set(-2.8, 1.9, 9.8);
    const colR = new THREE.Mesh(colGeo, facadeDarkAccent);
    colR.position.set(2.8, 1.9, 9.8);
    buildingGroup.add(colL);
    buildingGroup.add(colR);

    // 2. Main Tower Shaft (14 Residential Floors)
    const towerFloors = 13;
    const floorHeight = 1.6;
    const towerBaseY = 4.5;

    const towerCoreGeo = new THREE.BoxGeometry(13.6, towerFloors * floorHeight, 11.6);
    const towerCore = new THREE.Mesh(towerCoreGeo, facadeWhite);
    towerCore.position.set(0, towerBaseY + (towerFloors * floorHeight) / 2, 0);
    towerCore.castShadow = true;
    towerCore.receiveShadow = true;
    buildingGroup.add(towerCore);

    // Rhythmic Floor Slabs & Balconies
    for (let i = 0; i < towerFloors; i++) {
      const y = towerBaseY + i * floorHeight;

      // Slab line
      const slabGeo = new THREE.BoxGeometry(14.2, 0.15, 12.2);
      const slab = new THREE.Mesh(slabGeo, facadeDarkAccent);
      slab.position.set(0, y, 0);
      buildingGroup.add(slab);

      // Windows Front Facade
      const winGeo = new THREE.BoxGeometry(2.4, 1.1, 0.1);
      for (let wx = -4.5; wx <= 4.5; wx += 4.5) {
        const win = new THREE.Mesh(winGeo, glassMaterial);
        win.position.set(wx, y + 0.8, 5.86);
        buildingGroup.add(win);
      }

      // Windows Back Facade
      for (let wx = -4.5; wx <= 4.5; wx += 4.5) {
        const winB = new THREE.Mesh(winGeo, glassMaterial);
        winB.position.set(wx, y + 0.8, -5.86);
        buildingGroup.add(winB);
      }

      // Balconies Front (Every floor alternating or continuous)
      const balconyFloorGeo = new THREE.BoxGeometry(3.6, 0.12, 1.4);
      const balconyFloor = new THREE.Mesh(balconyFloorGeo, facadeWhite);
      balconyFloor.position.set(3.8, y + 0.1, 6.5);
      balconyFloor.castShadow = true;
      buildingGroup.add(balconyFloor);

      const balcGlassGeo = new THREE.BoxGeometry(3.6, 0.65, 0.08);
      const balcGlass = new THREE.Mesh(balcGlassGeo, glassMaterial);
      balcGlass.position.set(3.8, y + 0.48, 7.15);
      buildingGroup.add(balcGlass);
    }

    // 3. Penthouse Crown & Rooftop Terrace
    const penthouseY = towerBaseY + towerFloors * floorHeight;
    const penthouseGeo = new THREE.BoxGeometry(11, 2.8, 9.4);
    const penthouse = new THREE.Mesh(penthouseGeo, facadeDarkAccent);
    penthouse.position.set(0, penthouseY + 1.4, 0);
    penthouse.castShadow = true;
    buildingGroup.add(penthouse);

    // Crown Pergola / Cantilevered Roof
    const roofCanopyGeo = new THREE.BoxGeometry(14, 0.35, 12.4);
    const roofCanopy = new THREE.Mesh(roofCanopyGeo, goldAccent);
    roofCanopy.position.set(0, penthouseY + 3.0, 0);
    roofCanopy.castShadow = true;
    buildingGroup.add(roofCanopy);

    // Prominent "TEMER" Architectural Signage at the Crown
    // In Three.js we create an illuminated brand crest/block matching photo_2026-10-09_10-14-17.jpg
    const signGeo = new THREE.BoxGeometry(5.2, 1.2, 0.2);
    const signMat = new THREE.MeshStandardMaterial({
      color: 0x1d7b4d,
      emissive: 0x1d7b4d,
      emissiveIntensity: 0.6,
      roughness: 0.2
    });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, penthouseY + 2.0, 4.8);
    buildingGroup.add(sign);

    scene.add(buildingGroup);
  }

  function createHotspots() {
    hotspots = [];
    const hotspotGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const hotspotMat = new THREE.MeshBasicMaterial({
      color: 0xdfba73,
      wireframe: false
    });

    hotspotData.forEach(data => {
      const mesh = new THREE.Mesh(hotspotGeo, hotspotMat.clone());
      mesh.position.set(data.position.x, data.position.y, data.position.z);
      mesh.userData = data;

      // Glow halo ring
      const ringGeo = new THREE.RingGeometry(0.55, 0.75, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc5a059,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.lookAt(camera.position);
      mesh.add(ring);

      scene.add(mesh);
      hotspots.push(mesh);
    });
  }

  function onCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hotspots, false);

    if (intersects.length > 0) {
      const selected = intersects[0].object;
      showHotspotInfo(selected.userData);
      focusCamera(selected.position);
    }
  }

  function showHotspotInfo(data) {
    let card = document.getElementById('canvas-hotspot-card');
    if (!card) return;

    card.innerHTML = `
      <button class="hotspot-card-close" id="hotspot-card-close">&times;</button>
      <div class="badge-tag" style="margin-bottom:8px;">${data.category}</div>
      <h4>${data.name}</h4>
      <p>${data.description}</p>
      <div style="margin-top:14px;">
        <a href="pages/3d-explorer.html" class="btn btn-outline-gold btn-sm" style="width:100%;">
          Open in 3D Property Explorer &rarr;
        </a>
      </div>
    `;
    card.classList.add('active');

    document.getElementById('hotspot-card-close')?.addEventListener('click', () => {
      card.classList.remove('active');
    });
  }

  function focusCamera(targetPos) {
    if (!controls) return;
    const offset = { x: 12, y: 8, z: 14 };
    const startTime = performance.now();
    const duration = 1000;
    const startCam = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const startTarget = { x: controls.target.x, y: controls.target.y, z: controls.target.z };
    const endCam = { x: targetPos.x + offset.x, y: targetPos.y + offset.y, z: targetPos.z + offset.z };
    const endTarget = { x: targetPos.x, y: targetPos.y, z: targetPos.z };

    function step(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);

      camera.position.set(
        startCam.x + (endCam.x - startCam.x) * ease,
        startCam.y + (endCam.y - startCam.y) * ease,
        startCam.z + (endCam.z - startCam.z) * ease
      );
      controls.target.set(
        startTarget.x + (endTarget.x - startTarget.x) * ease,
        startTarget.y + (endTarget.y - startTarget.y) * ease,
        startTarget.z + (endTarget.z - startTarget.z) * ease
      );

      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function setupControlsHUD() {
    const btnRotate = document.getElementById('hud-btn-rotate');
    const btnTime = document.getElementById('hud-btn-time');
    const btnReset = document.getElementById('hud-btn-reset');
    const btnFullscreen = document.getElementById('hud-btn-fullscreen');

    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        autoRotate = !autoRotate;
        if (controls) controls.autoRotate = autoRotate;
        btnRotate.classList.toggle('active', autoRotate);
      });
    }

    if (btnTime) {
      btnTime.addEventListener('click', () => {
        isNight = !isNight;
        btnTime.classList.toggle('active', isNight);
        toggleDayNight(isNight);
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        focusCamera({ x: 0, y: 12, z: 0 });
        document.getElementById('canvas-hotspot-card')?.classList.remove('active');
      });
    }

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch(err => console.warn(err));
        } else {
          document.exitFullscreen().catch(err => console.warn(err));
        }
      });
    }
  }

  function toggleDayNight(night) {
    if (night) {
      scene.background.set(0x06070a);
      scene.fog.color.set(0x06070a);
      ambientLight.color.set(0x445577);
      ambientLight.intensity = 0.25;
      dirLight.color.set(0x7799bb);
      dirLight.intensity = 0.4;
      hemiLight.intensity = 0.2;
    } else {
      scene.background.set(0x0c0f16);
      scene.fog.color.set(0x0c0f16);
      ambientLight.color.set(0xffffff);
      ambientLight.intensity = 0.45;
      dirLight.color.set(0xfff4e6);
      dirLight.intensity = 1.4;
      hemiLight.intensity = 0.55;
    }
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    if (!isRendering) return;
    requestAnimationFrame(animate);

    const time = performance.now() * 0.002;

    // Pulse hotspots and face camera
    hotspots.forEach((h, i) => {
      const ring = h.children[0];
      if (ring) {
        ring.lookAt(camera.position);
        ring.scale.setScalar(1 + 0.15 * Math.sin(time * 3 + i));
      }
    });

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
})();
