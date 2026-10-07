(function () {
  "use strict";

  var canvas = document.getElementById("bg-canvas");
  if (!canvas || typeof window.THREE !== "object") {
    return;
  }

  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
  } catch (error) {
    canvas.classList.add("is-hidden");
    return;
  }

  if (!renderer) return;

  var smallScreen = window.innerWidth < 760;
  var useShadows = !smallScreen && !reduceMotion;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xdbe7f2, 0.03);

  var camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    140
  );
  camera.position.set(0, 0, 12);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  if (useShadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  var world = new THREE.Group();
  scene.add(world);

  function matte(color, options) {
    options = options || {};
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: options.roughness != null ? options.roughness : 0.66,
      metalness: options.metalness != null ? options.metalness : 0.06,
      emissive: options.emissive != null ? options.emissive : 0x000000,
      emissiveIntensity:
        options.emissiveIntensity != null ? options.emissiveIntensity : 0,
      transparent: options.transparent === true,
      opacity: options.opacity != null ? options.opacity : 1
    });
  }

  var PAGE = 0xf6f0e0;
  var METAL = 0xc4ccd6;

  function makeBook(width, height, depth, coverColor, pageColor) {
    var group = new THREE.Group();
    var cover = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      matte(coverColor, { roughness: 0.62 })
    );
    group.add(cover);

    var pages = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.9, height * 0.92, depth * 0.96),
      matte(pageColor || PAGE, { roughness: 0.9 })
    );
    pages.position.x = width * 0.07;
    group.add(pages);

    var spine = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.12, height * 1.01, depth * 1.01),
      matte(coverColor, { roughness: 0.5 })
    );
    spine.position.x = -width * 0.44;
    group.add(spine);

    return group;
  }

  function makeBookStack(colors) {
    var group = new THREE.Group();
    var y = 0;
    colors.forEach(function (color, index) {
      var width = 2.3 - index * 0.28;
      var depth = 1.7 - index * 0.18;
      var height = 0.4;
      var book = makeBook(width, height, depth, color);
      book.position.set((index % 2 ? 0.12 : -0.1), y + height / 2, 0);
      book.rotation.y = (index - 1) * 0.16;
      group.add(book);
      y += height + 0.03;
    });
    return group;
  }

  function makeOpenBook() {
    var group = new THREE.Group();
    var pages = matte(PAGE, { roughness: 0.9 });
    var cover = matte(0x0d9488, { roughness: 0.55 });

    [-1, 1].forEach(function (side) {
      var coverMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.75, 0.09, 2.35),
        cover
      );
      coverMesh.position.set(side * 0.86, 0.28, 0);
      coverMesh.rotation.z = side * 0.26;
      group.add(coverMesh);

      var pageMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.66, 0.12, 2.24),
        pages
      );
      pageMesh.position.set(side * 0.84, 0.37, 0);
      pageMesh.rotation.z = side * 0.26;
      group.add(pageMesh);
    });

    var spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.16, 2.36),
      matte(0x0b1f33, { roughness: 0.5 })
    );
    spine.position.y = 0.3;
    group.add(spine);

    var ribbon = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.02, 0.7),
      matte(0xf59e0b, { roughness: 0.6 })
    );
    ribbon.position.set(0, 0.46, 0.7);
    group.add(ribbon);

    return group;
  }

  function makeGradCap() {
    var group = new THREE.Group();

    var base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.72, 0.6, 28),
      matte(0x0b1f33, { roughness: 0.5 })
    );
    base.position.y = -0.02;
    group.add(base);

    var board = new THREE.Mesh(
      new THREE.BoxGeometry(1.85, 0.1, 1.85),
      matte(0x123150, { roughness: 0.42 })
    );
    board.position.y = 0.34;
    board.rotation.y = Math.PI / 4;
    group.add(board);

    var button = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 18, 18),
      matte(0xf59e0b, { metalness: 0.45, roughness: 0.35 })
    );
    button.position.y = 0.43;
    group.add(button);

    var cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.62, 8),
      matte(0xf59e0b, { metalness: 0.3, roughness: 0.5 })
    );
    cord.position.set(0.62, 0.16, 0.62);
    group.add(cord);

    var tassel = new THREE.Mesh(
      new THREE.ConeGeometry(0.09, 0.3, 12),
      matte(0xfbbf24, { metalness: 0.25, roughness: 0.55 })
    );
    tassel.position.set(0.62, -0.22, 0.62);
    tassel.rotation.z = Math.PI;
    group.add(tassel);

    return group;
  }

  function makePencil() {
    var group = new THREE.Group();
    var length = 2.4;

    var body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.17, length, 6),
      matte(0xf5b301, { roughness: 0.42 })
    );
    group.add(body);

    var wood = new THREE.Mesh(
      new THREE.ConeGeometry(0.17, 0.34, 6),
      matte(0xd8b98a, { roughness: 0.8 })
    );
    wood.position.y = -(length / 2) - 0.17;
    wood.rotation.x = Math.PI;
    group.add(wood);

    var graphite = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.16, 6),
      matte(0x2b2b2b, { roughness: 0.5 })
    );
    graphite.position.y = -(length / 2) - 0.34 - 0.07;
    graphite.rotation.x = Math.PI;
    group.add(graphite);

    var ferrule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.22, 16),
      matte(METAL, { metalness: 0.85, roughness: 0.25 })
    );
    ferrule.position.y = length / 2 + 0.11;
    group.add(ferrule);

    var eraser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.17, 0.26, 18),
      matte(0xf28fb0, { roughness: 0.72 })
    );
    eraser.position.y = length / 2 + 0.34;
    group.add(eraser);

    return group;
  }

  function makeBulb() {
    var group = new THREE.Group();

    var glass = new THREE.Mesh(
      new THREE.SphereGeometry(0.58, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xfff2c6,
        roughness: 0.08,
        metalness: 0,
        transparent: true,
        opacity: 0.62,
        emissive: 0xffcf5c,
        emissiveIntensity: 0.85
      })
    );
    glass.position.y = 0.4;
    group.add(glass);

    var neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.34, 0.36, 24),
      matte(0xf4e7c2, { roughness: 0.2, opacity: 0.7, transparent: true })
    );
    neck.position.y = -0.06;
    group.add(neck);

    var socket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.4, 20),
      matte(METAL, { metalness: 0.88, roughness: 0.28 })
    );
    socket.position.y = -0.42;
    group.add(socket);

    var filament = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.03, 0.03),
      matte(0xffb347, { emissive: 0xffa726, emissiveIntensity: 2.2 })
    );
    filament.position.y = 0.4;
    group.add(filament);

    var light = new THREE.PointLight(0xffd88a, 1.35, 9);
    light.position.y = 0.4;
    group.add(light);

    return group;
  }

  function letterTexture(letter, background) {
    var size = 128;
    var c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    var ctx = c.getContext("2d");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#0b1f33";
    ctx.font = "bold 82px Arial, Helvetica, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, size / 2, size / 2 + 4);
    var texture = new THREE.CanvasTexture(c);
    texture.anisotropy = 4;
    return texture;
  }

  function makeBlock(letter, color) {
    var faceMaterial = new THREE.MeshStandardMaterial({
      map: letterTexture(letter, color),
      roughness: 0.58,
      metalness: 0.04
    });
    var sideMaterial = matte(color, { roughness: 0.58 });
    var materials = [
      sideMaterial,
      sideMaterial,
      sideMaterial,
      sideMaterial,
      faceMaterial,
      faceMaterial
    ];
    return new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.98, 0.98), materials);
  }

  function makePaperPlane() {
    var group = new THREE.Group();
    var paper = matte(0xeef3f9, { roughness: 0.5, metalness: 0.04 });

    var left = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 1.5), paper);
    left.position.set(-0.45, 0, 0);
    left.rotation.z = 0.24;
    left.rotation.y = 0.13;
    group.add(left);

    var right = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 1.5), paper);
    right.position.set(0.45, 0, 0);
    right.rotation.z = -0.24;
    right.rotation.y = -0.13;
    group.add(right);

    var fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.4, 0.9), paper);
    fin.position.set(0, 0.2, -0.3);
    group.add(fin);

    return group;
  }

  var items = [
    { object: makeOpenBook(), position: [-7.2, 2.0, -4.6], scale: 1.2, rotation: [0.1, 0.55, 0] },
    { object: makeBookStack([0x0d9488, 0x1b4a73, 0xd97706]), position: [-7.0, -4.9, -5.4], scale: 1.05 },
    { object: makeGradCap(), position: [4.6, 3.4, -6.2], scale: 1.25, rotation: [-0.1, -0.5, 0.05] },
    { object: makePencil(), position: [-4.4, -4.8, -4.8], scale: 1.15, rotation: [0.35, 0, 0.5] },
    { object: makeBulb(), position: [1.4, -5.4, -7.0], scale: 1.15 },
    { object: makeBlock("A", 0x38bdf8), position: [-8.6, -5.2, -5.2], scale: 1.05 },
    { object: makeBlock("B", 0x34d399), position: [8.8, 1.2, -6.6], scale: 0.95 },
    { object: makeBlock("C", 0xfbbf24), position: [-2.4, -5.8, -6.6], scale: 0.92 },
    { object: makePaperPlane(), position: [8.8, 3.2, -2.8], scale: 1.0, rotation: [0.05, -0.55, 0] },
    { object: makeBook(1.7, 0.42, 1.25, 0x4338ca), position: [6.2, 5.9, -7.6], scale: 0.95, rotation: [0, 0.7, 0.12] },
    { object: makeBook(1.5, 0.38, 1.15, 0xb91c1c), position: [6.8, -5.2, -3.4], scale: 1.0, rotation: [0.15, -0.6, -0.1] }
  ];

  items.forEach(function (item, index) {
    var group = item.object;
    group.position.set(item.position[0], item.position[1], item.position[2]);
    group.scale.setScalar(item.scale);
    if (item.rotation) {
      group.rotation.set(item.rotation[0], item.rotation[1], item.rotation[2]);
    }

    group.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = useShadows;
        child.receiveShadow = useShadows;
      }
    });

    group.userData.spin = {
      y: 0.0016 + index * 0.0004,
      x: 0.0006 + index * 0.0002,
      bob: 0.3 + (index % 3) * 0.16,
      phase: index * 1.7
    };
    group.userData.baseY = item.position[1];

    world.add(group);
  });

  var particleCount = smallScreen ? 550 : 1200;
  var positions = new Float32Array(particleCount * 3);
  for (var i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 34;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 28 - 4;
  }

  var particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  var particleMaterial = new THREE.PointsMaterial({
    color: 0x0d9488,
    size: 0.05,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    sizeAttenuation: true
  });

  var particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  var ground = null;
  if (useShadows) {
    ground = new THREE.Mesh(
      new THREE.PlaneGeometry(70, 70),
      new THREE.ShadowMaterial({ opacity: 0.18 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -6.4;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  var ambient = new THREE.AmbientLight(0x8fb7d6, 0.8);
  scene.add(ambient);

  var hemi = new THREE.HemisphereLight(0xffffff, 0x9fb3c8, 0.55);
  scene.add(hemi);

  var keyLight = new THREE.DirectionalLight(0xfff4e0, 1.25);
  keyLight.position.set(7, 11, 8);
  if (useShadows) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    var shadowCam = keyLight.shadow.camera;
    shadowCam.left = -18;
    shadowCam.right = 18;
    shadowCam.top = 18;
    shadowCam.bottom = -18;
    shadowCam.near = 1;
    shadowCam.far = 55;
    keyLight.shadow.bias = -0.0006;
  }
  scene.add(keyLight);

  var tealLight = new THREE.PointLight(0x14b8a6, 2.2, 42);
  tealLight.position.set(-7, -3, 4);
  scene.add(tealLight);

  var iceLight = new THREE.PointLight(0x38bdf8, 1.7, 42);
  iceLight.position.set(8, 5, 2);
  scene.add(iceLight);

  function applyTheme(theme) {
    var light = theme === "light";
    scene.fog.color.setHex(light ? 0xdbe7f2 : 0x050b16);
    particleMaterial.color.setHex(light ? 0x0d9488 : 0x7dd3fc);
    particleMaterial.opacity = light ? 0.48 : 0.7;
    ambient.intensity = light ? 1.05 : 0.95;
    hemi.intensity = light ? 0.7 : 0.9;
    keyLight.intensity = light ? 1.05 : 1.5;
    renderer.setClearColor(0x000000, light ? 0.03 : 0);
  }

  applyTheme(document.documentElement.getAttribute("data-theme") || "light");

  document.addEventListener("themechange", function (event) {
    var theme =
      event.detail && event.detail.theme ? event.detail.theme : "light";
    applyTheme(theme);
  });

  var pointer = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };
  var scrollRatio = 0;
  var scrollTarget = 0;
  var visible = true;

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  }

  function onScroll() {
    var max =
      document.documentElement.scrollHeight - window.innerHeight || 1;
    scrollTarget = Math.min(Math.max(window.scrollY / max, 0), 1);
  }

  function onResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  function onVisibilityChange() {
    visible = !document.hidden;
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibilityChange);

  var clock = new THREE.Clock();
  var frameId = null;

  function render() {
    frameId = window.requestAnimationFrame(render);
    if (!visible) return;

    var elapsed = clock.getElapsedTime();
    var delta = reduceMotion ? 0 : 1;

    target.x += (pointer.x * 0.9 - target.x) * 0.045;
    target.y += (pointer.y * 0.6 - target.y) * 0.045;
    scrollRatio += (scrollTarget - scrollRatio) * 0.06;

    camera.position.x = target.x * 1.9;
    camera.position.y = -target.y * 1.4 + scrollRatio * 2.2;
    camera.position.z = 12 - scrollRatio * 3.2;
    camera.lookAt(0, scrollRatio * 0.9, -2);

    world.rotation.y = elapsed * 0.03 * delta + target.x * 0.22;
    world.rotation.x = target.y * 0.12;

    items.forEach(function (item) {
      var group = item.object;
      var spin = group.userData.spin;
      group.rotation.y += spin.y * delta;
      group.rotation.x += spin.x * delta;
      group.position.y =
        group.userData.baseY +
        Math.sin(elapsed * 0.5 + spin.phase) * 0.34 * spin.bob * (1 - scrollRatio);
    });

    particles.rotation.y = elapsed * 0.01 * delta + target.x * 0.08;
    particles.rotation.x = -scrollRatio * 0.22;

    tealLight.position.x = Math.sin(elapsed * 0.35) * 8;
    iceLight.position.y = Math.cos(elapsed * 0.4) * 6;

    renderer.render(scene, camera);
  }

  render();

  window.addEventListener("pagehide", function () {
    if (frameId) window.cancelAnimationFrame(frameId);
  });
})();
