// --- 3D Scene Initialization for Apex Auto Detailing ---
const canvas = document.getElementById('auto-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 16);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const ambientLight = new THREE.AmbientLight(0x222225, 1.5);
scene.add(ambientLight);

// Studio Spotlights
const spotLight1 = new THREE.SpotLight(0xf59e0b, 3, 30, Math.PI / 4, 0.5);
spotLight1.position.set(8, 12, 8);
scene.add(spotLight1);

const spotLight2 = new THREE.SpotLight(0xffffff, 2, 30, Math.PI / 4, 0.5);
spotLight2.position.set(-8, 10, -5);
scene.add(spotLight2);

// Car Group
const carGroup = new THREE.Group();
scene.add(carGroup);

// Materials
const carPaintMat = new THREE.MeshPhysicalMaterial({
  color: 0x111216,
  metalness: 0.9,
  roughness: 0.15,
  clearcoat: 1.0,
  clearcoatRoughness: 0.05
});

const amberGlassMat = new THREE.MeshPhysicalMaterial({
  color: 0xf59e0b,
  transmission: 0.9,
  opacity: 1,
  transparent: true,
  roughness: 0.1,
  ior: 1.5
});

const carbonMat = new THREE.MeshStandardMaterial({
  color: 0x050505,
  roughness: 0.8,
  metalness: 0.2
});

const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

// 1. Aerodynamic Lower Body / Chassis
const chassisGeo = new THREE.BoxGeometry(7.2, 0.9, 3.4);
const chassisMesh = new THREE.Mesh(chassisGeo, carPaintMat);
chassisMesh.position.y = 0.8;
carGroup.add(chassisMesh);

// 2. Cabin / Roof (Sleek Coupe Line)
const cabinGeo = new THREE.BoxGeometry(4.0, 0.9, 2.7);
const cabinMesh = new THREE.Mesh(cabinGeo, amberGlassMat);
cabinMesh.position.set(-0.3, 1.6, 0);
carGroup.add(cabinMesh);

// 3. Hood slope
const hoodGeo = new THREE.CylinderGeometry(1.7, 1.7, 2.2, 3, 1, false, 0, Math.PI);
const hoodMesh = new THREE.Mesh(hoodGeo, carPaintMat);
hoodMesh.rotation.z = Math.PI / 2;
hoodMesh.position.set(2.4, 0.9, 0);
hoodMesh.scale.set(0.6, 1, 1.5);
carGroup.add(hoodMesh);

// 4. Rear Wing / Spoiler
const spoilerGeo = new THREE.BoxGeometry(0.8, 0.1, 3.2);
const spoilerMesh = new THREE.Mesh(spoilerGeo, carbonMat);
spoilerMesh.position.set(-3.2, 1.8, 0);
carGroup.add(spoilerMesh);

const spoilerPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), carbonMat);
spoilerPost1.position.set(-3.2, 1.5, 0.9);
carGroup.add(spoilerPost1);

const spoilerPost2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), carbonMat);
spoilerPost2.position.set(-3.2, 1.5, -0.9);
carGroup.add(spoilerPost2);

// 5. Wheels
const wheelGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.5, 24);
const wheelRimGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.52, 16);
const rimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });

const wheelPositions = [
  [2.2, 0.75, 1.7],
  [-2.2, 0.75, 1.7],
  [2.2, 0.75, -1.7],
  [-2.2, 0.75, -1.7]
];

wheelPositions.forEach(pos => {
  const wheel = new THREE.Mesh(wheelGeo, carbonMat);
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(...pos);

  const rim = new THREE.Mesh(wheelRimGeo, rimMat);
  wheel.add(rim);

  carGroup.add(wheel);
});

// 6. LED Headlights & Taillights
const headlight1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.7), headlightMat);
headlight1.position.set(3.6, 0.8, 1.1);
carGroup.add(headlight1);

const headlight2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.7), headlightMat);
headlight2.position.set(3.6, 0.8, -1.1);
carGroup.add(headlight2);

const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 3.0), taillightMat);
taillight.position.set(-3.6, 0.9, 0);
carGroup.add(taillight);

// 7. Studio Wireframe Grid Floor
const gridHelper = new THREE.GridHelper(40, 40, 0xf59e0b, 0x222226);
gridHelper.position.y = 0;
scene.add(gridHelper);

// Positioning
function setCarPos() {
  if (window.innerWidth > 900) {
    carGroup.position.set(3.5, 0, 0);
  } else {
    carGroup.position.set(0, -1, -3);
  }
}
setCarPos();

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
let rotX = 0.2;
let rotY = 0.6;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  setCarPos();
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  rotX += (mouseY * 0.5 - rotX + 0.15) * 0.04;
  rotY += (mouseX * 1.5 - rotY + 0.6) * 0.04;

  carGroup.rotation.x = rotX;
  carGroup.rotation.y = rotY + Math.sin(time * 0.4) * 0.1;

  renderer.render(scene, camera);
}
animate();

// --- Interactive Before / After Comparison Slider ---
const sliderContainer = document.getElementById('comparison-slider');
const afterLayer = document.getElementById('after-layer');
const sliderHandle = document.getElementById('slider-handle');

let isDragging = false;

function updateSlider(clientX) {
  const rect = sliderContainer.getBoundingClientRect();
  let x = clientX - rect.left;
  // Clamp
  x = Math.max(0, Math.min(x, rect.width));
  const percent = (x / rect.width) * 100;

  afterLayer.style.width = percent + '%';
  sliderHandle.style.left = percent + '%';
}

sliderContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  updateSlider(e.clientX);
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  updateSlider(e.clientX);
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Touch support for mobile
sliderContainer.addEventListener('touchstart', (e) => {
  isDragging = true;
  if (e.touches.length > 0) {
    updateSlider(e.touches[0].clientX);
  }
});

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  if (e.touches.length > 0) {
    updateSlider(e.touches[0].clientX);
  }
});

window.addEventListener('touchend', () => {
  isDragging = false;
});
