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

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050b16, 0.045);

  var camera = new THREE.PerspectiveCamera(
    58,
    window.innerWidth / window.innerHeight,
    0.1,
    120
  );
  camera.position.set(0, 0, 11);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  var world = new THREE.Group();
  scene.add(world);

  var teal = new THREE.Color(0x14b8a6);
  var deepTeal = new THREE.Color(0x0d9488);
  var ice = new THREE.Color(0x67e8f9);
  var navy = new THREE.Color(0x17395c);

  var geometries = [
    { geometry: new THREE.IcosahedronGeometry(1.5, 0), color: teal, wire: true },
    { geometry: new THREE.TorusGeometry(1.1, 0.34, 20, 40), color: ice },
    { geometry: new THREE.TorusKnotGeometry(0.78, 0.24, 120, 16), color: deepTeal },
    { geometry: new THREE.OctahedronGeometry(1.05, 0), color: ice, wire: true },
    { geometry: new THREE.BoxGeometry(1.4, 1.4, 1.4), color: navy },
    { geometry: new THREE.DodecahedronGeometry(0.95, 0), color: teal },
    { geometry: new THREE.TetrahedronGeometry(1.15, 0), color: deepTeal, wire: true }
  ];

  var nodes = [];
  geometries.forEach(function (item, index) {
    var material;
    if (item.wire) {
      material = new THREE.MeshBasicMaterial({
        color: item.color,
        wireframe: true,
        transparent: true,
        opacity: 0.55
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: item.color,
        metalness: 0.65,
        roughness: 0.28,
        transparent: true,
        opacity: 0.82,
        emissive: item.color,
        emissiveIntensity: 0.28
      });
    }

    var mesh = new THREE.Mesh(item.geometry, material);
    var angle = (index / geometries.length) * Math.PI * 2;

    mesh.position.set(
      Math.cos(angle) * (5 + (index % 3) * 0.9),
      Math.sin(angle * 1.4) * 3.1,
      -2 - (index % 4) * 2.1
    );
    mesh.rotation.set(angle, angle * 0.7, 0);

    mesh.userData.spin = {
      x: 0.0014 + index * 0.0006,
      y: 0.0018 + index * 0.0005,
      bob: 0.35 + (index % 3) * 0.18,
      phase: angle
    };

    world.add(mesh);
    nodes.push(mesh);
  });

  var particleCount = window.innerWidth < 720 ? 650 : 1300;
  var positions = new Float32Array(particleCount * 3);
  for (var i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 26 - 4;
  }

  var particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  var particleMaterial = new THREE.PointsMaterial({
    color: 0x7dd3fc,
    size: 0.055,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    sizeAttenuation: true
  });

  var particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  var ambient = new THREE.AmbientLight(0x8fb7d6, 0.75);
  scene.add(ambient);

  var keyLight = new THREE.DirectionalLight(0x99f6e4, 1.15);
  keyLight.position.set(6, 8, 6);
  scene.add(keyLight);

  var tealLight = new THREE.PointLight(0x14b8a6, 2.4, 40);
  tealLight.position.set(-7, -3, 4);
  scene.add(tealLight);

  var iceLight = new THREE.PointLight(0x38bdf8, 1.9, 40);
  iceLight.position.set(8, 5, 2);
  scene.add(iceLight);

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

    camera.position.x = target.x * 2.1;
    camera.position.y = -target.y * 1.5 + scrollRatio * 2.4;
    camera.position.z = 11 - scrollRatio * 3.4;
    camera.lookAt(0, scrollRatio * 0.8, -2);

    world.rotation.y = elapsed * 0.045 * delta + target.x * 0.28;
    world.rotation.x = target.y * 0.16;

    nodes.forEach(function (mesh) {
      var spin = mesh.userData.spin;
      mesh.rotation.x += spin.x * delta;
      mesh.rotation.y += spin.y * delta;
      mesh.position.y +=
        Math.sin(elapsed * 0.5 + spin.phase) * 0.0035 * spin.bob * (1 - scrollRatio);
    });

    particles.rotation.y = elapsed * 0.012 * delta + target.x * 0.1;
    particles.rotation.x = -scrollRatio * 0.28;

    tealLight.position.x = Math.sin(elapsed * 0.35) * 8;
    iceLight.position.y = Math.cos(elapsed * 0.4) * 6;

    renderer.render(scene, camera);
  }

  render();

  window.addEventListener("pagehide", function () {
    if (frameId) window.cancelAnimationFrame(frameId);
  });
})();
