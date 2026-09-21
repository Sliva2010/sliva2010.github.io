// --- 3D Scene Initialization with Three.js ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 24;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Morphing 3D Particle Sphere
const particleCount = 2200;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const originalPositions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

const colorPrimary = new THREE.Color('#6366f1');
const colorAccent = new THREE.Color('#06b6d4');
const colorWhite = new THREE.Color('#ffffff');

for (let i = 0; i < particleCount; i++) {
  // Generate points on sphere
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = 9 + Math.random() * 1.5;

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  originalPositions[i * 3] = x;
  originalPositions[i * 3 + 1] = y;
  originalPositions[i * 3 + 2] = z;

  // Mixed glowing palette
  const mixedColor = Math.random() > 0.4 ? colorPrimary : (Math.random() > 0.5 ? colorAccent : colorWhite);
  colors[i * 3] = mixedColor.r;
  colors[i * 3 + 1] = mixedColor.g;
  colors[i * 3 + 2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Particle Material
const material = new THREE.PointsMaterial({
  size: 0.14,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending
});

const particleMesh = new THREE.Points(geometry, material);
scene.add(particleMesh);

// Outer Ring
const ringGeo = new THREE.TorusGeometry(12.5, 0.04, 16, 100);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.25, wireframe: true });
const ringMesh = new THREE.Mesh(ringGeo, ringMat);
ringMesh.rotation.x = Math.PI / 3;
scene.add(ringMesh);

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
});

// Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  // Smooth mouse inertia
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  particleMesh.rotation.y = elapsedTime * 0.08 + targetX * 2;
  particleMesh.rotation.x = elapsedTime * 0.04 + targetY * 2;

  ringMesh.rotation.z = elapsedTime * 0.05;
  ringMesh.rotation.y = elapsedTime * 0.02;

  // Wave deformation effect on particles
  const posArray = geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const ox = originalPositions[i3];
    const oy = originalPositions[i3 + 1];
    const oz = originalPositions[i3 + 2];

    const wave = Math.sin(elapsedTime * 2 + ox * 0.5 + oy * 0.5) * 0.3;
    posArray[i3] = ox + (ox / 9) * wave;
    posArray[i3 + 1] = oy + (oy / 9) * wave;
    posArray[i3 + 2] = oz + (oz / 9) * wave;
  }
  geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();

// --- Interactive Project Calculator ---
const typeButtons = document.querySelectorAll('#type-selector .radio-btn');
const graphicsButtons = document.querySelectorAll('#graphics-selector .radio-btn');
const optionCheckboxes = document.querySelectorAll('.custom-checkbox input');
const totalPriceEl = document.getElementById('total-price');
const totalDaysEl = document.getElementById('total-days');

function calculateTotal() {
  let basePrice = 25000;
  let days = '3–5 рабочих дней';

  typeButtons.forEach(btn => {
    if (btn.classList.contains('active')) {
      basePrice = parseInt(btn.dataset.cost);
      if (btn.textContent.includes('Telegram')) days = '4–7 рабочих дней';
      if (btn.textContent.includes('Корпоративный')) days = '7–12 рабочих дней';
      if (btn.textContent.includes('Комплекс')) days = '10–14 рабочих дней';
    }
  });

  graphicsButtons.forEach(btn => {
    if (btn.classList.contains('active')) {
      basePrice += parseInt(btn.dataset.cost);
    }
  });

  optionCheckboxes.forEach(cb => {
    if (cb.checked) {
      basePrice += parseInt(cb.dataset.cost);
    }
  });

  totalPriceEl.textContent = basePrice.toLocaleString('ru-RU') + ' ₽';
  totalDaysEl.textContent = days;
}

typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    calculateTotal();
  });
});

graphicsButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    graphicsButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    calculateTotal();
  });
});

optionCheckboxes.forEach(cb => {
  cb.addEventListener('change', calculateTotal);
});
