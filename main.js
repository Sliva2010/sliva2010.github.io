// --- 3D Scene Initialization for Vyacheslav's Portfolio ---
const canvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 22;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x6366f1, 3, 40);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00f2fe, 3, 40);
pointLight2.position.set(-10, -10, 8);
scene.add(pointLight2);

// Central Futuristic Crystal
const crystalGroup = new THREE.Group();
scene.add(crystalGroup);

// Inner Core - Shiny Icosahedron
const coreGeo = new THREE.IcosahedronGeometry(4.5, 0);
const coreMat = new THREE.MeshPhysicalMaterial({
  color: 0x111827,
  emissive: 0x312e81,
  roughness: 0.1,
  metalness: 0.9,
  clearcoat: 1.0,
  wireframe: false
});
const coreMesh = new THREE.Mesh(coreGeo, coreMat);
crystalGroup.add(coreMesh);

// Outer Wireframe Cage
const cageGeo = new THREE.IcosahedronGeometry(5.8, 1);
const cageMat = new THREE.MeshBasicMaterial({
  color: 0x00f2fe,
  wireframe: true,
  transparent: true,
  opacity: 0.35
});
const cageMesh = new THREE.Mesh(cageGeo, cageMat);
crystalGroup.add(cageMesh);

// Orbiting Rings
const ringGeo1 = new THREE.TorusGeometry(8.5, 0.05, 16, 100);
const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.4 });
const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
ring1.rotation.x = Math.PI / 3;
crystalGroup.add(ring1);

const ringGeo2 = new THREE.TorusGeometry(9.8, 0.04, 16, 100);
const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.3 });
const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
ring2.rotation.y = Math.PI / 4;
crystalGroup.add(ring2);

// Ambient Floating Cyber Particles
const particleCount = 700;
const particleGeo = new THREE.BufferGeometry();
const particlePos = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);

const c1 = new THREE.Color('#6366f1');
const c2 = new THREE.Color('#00f2fe');

for (let i = 0; i < particleCount; i++) {
  particlePos[i * 3] = (Math.random() - 0.5) * 50;
  particlePos[i * 3 + 1] = (Math.random() - 0.5) * 40;
  particlePos[i * 3 + 2] = (Math.random() - 0.5) * 35;

  const col = Math.random() > 0.5 ? c1 : c2;
  particleColors[i * 3] = col.r;
  particleColors[i * 3 + 1] = col.g;
  particleColors[i * 3 + 2] = col.b;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMat = new THREE.PointsMaterial({
  size: 0.12,
  vertexColors: true,
  transparent: true,
  opacity: 0.65,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// Mouse Movement & Inertia
let mouseX = 0;
let mouseY = 0;
let targetRotX = 0;
let targetRotY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  targetRotX += (mouseY - targetRotX) * 0.05;
  targetRotY += (mouseX - targetRotY) * 0.05;

  // Crystal rotations
  coreMesh.rotation.y = time * 0.2 + targetRotY;
  coreMesh.rotation.x = time * 0.1 + targetRotX;

  cageMesh.rotation.y = -time * 0.15 + targetRotY * 1.5;
  cageMesh.rotation.z = time * 0.08;

  ring1.rotation.z = time * 0.15;
  ring2.rotation.x = time * 0.1;

  // Float effect
  crystalGroup.position.y = Math.sin(time * 1.2) * 0.6;

  // Swirl particles
  particles.rotation.y = time * 0.03 + targetRotY * 0.5;

  renderer.render(scene, camera);
}
animate();
