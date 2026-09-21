// --- 3D FinTech Holographic Card & Tokens ---
const canvas = document.getElementById('fintech-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 16);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const cyanLight = new THREE.PointLight(0x00f2fe, 3, 25);
cyanLight.position.set(6, 6, 8);
scene.add(cyanLight);

const purpleLight = new THREE.PointLight(0xa855f7, 2.5, 25);
purpleLight.position.set(-6, -6, 5);
scene.add(purpleLight);

// Group for Card & Orbiting elements
const cardGroup = new THREE.Group();
scene.add(cardGroup);

// --- 1. Realistic 3D Bank Card ---
// Card dimensions: width: 8.56, height: 5.4, depth: 0.18 (ISO/IEC 7810 standard proportions)
const cardWidth = 7.5;
const cardHeight = 4.7;
const cardDepth = 0.16;

const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
const cardMat = new THREE.MeshPhysicalMaterial({
  color: 0x0f172a,
  roughness: 0.2,
  metalness: 0.85,
  clearcoat: 0.8,
  clearcoatRoughness: 0.15,
  reflectivity: 0.9,
  transmission: 0.1
});
const cardMesh = new THREE.Mesh(cardGeo, cardMat);
cardGroup.add(cardMesh);

// Glowing Edge Rim on Card
const cardEdges = new THREE.EdgesGeometry(cardGeo);
const edgeMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2, transparent: true, opacity: 0.6 });
const edgeMesh = new THREE.LineSegments(cardEdges, edgeMat);
cardMesh.add(edgeMesh);

// Golden EMV Chip
const chipGeo = new THREE.BoxGeometry(1.1, 0.9, 0.04);
const chipMat = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  metalness: 0.9,
  roughness: 0.3
});
const chipMesh = new THREE.Mesh(chipGeo, chipMat);
chipMesh.position.set(-2.2, 0.6, cardDepth / 2 + 0.02);
cardMesh.add(chipMesh);

// Hologram Foil Patch
const holoGeo = new THREE.PlaneGeometry(1.2, 1.2);
const holoMat = new THREE.MeshPhysicalMaterial({
  color: 0x06b6d4,
  roughness: 0.1,
  metalness: 0.9,
  clearcoat: 1.0,
  emissive: 0x0891b2,
  emissiveIntensity: 0.4
});
const holoMesh = new THREE.Mesh(holoGeo, holoMat);
holoMesh.position.set(2.4, 1.3, cardDepth / 2 + 0.02);
cardMesh.add(holoMesh);

// --- 2. Orbiting Crypto Tokens ---
const tokenGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 32);
const tokenMatGold = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.2 });
const tokenMatCyan = new THREE.MeshStandardMaterial({ color: 0x00f2fe, metalness: 0.9, roughness: 0.25 });
const tokenMatPurple = new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.85, roughness: 0.3 });

const tokenMaterials = [tokenMatGold, tokenMatCyan, tokenMatPurple];
const tokens = [];

for (let i = 0; i < 3; i++) {
  const token = new THREE.Mesh(tokenGeo, tokenMaterials[i]);
  token.rotation.x = Math.PI / 2;
  scene.add(token);
  tokens.push({
    mesh: token,
    angle: (i / 3) * Math.PI * 2,
    speed: 0.015 + i * 0.005,
    orbitRadiusX: 6.5 + i * 0.8,
    orbitRadiusZ: 4.5 + i * 0.5,
    yOffset: (i - 1) * 1.5
  });
}

// Background Star/Data Particles
const partCount = 400;
const partGeo = new THREE.BufferGeometry();
const partPos = new Float32Array(partCount * 3);

for (let i = 0; i < partCount; i++) {
  partPos[i * 3] = (Math.random() - 0.5) * 50;
  partPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
  partPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
}

partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
const partMat = new THREE.PointsMaterial({
  color: 0x38bdf8,
  size: 0.12,
  transparent: true,
  opacity: 0.5
});
const particles = new THREE.Points(partGeo, partMat);
scene.add(particles);

// Position card properly on desktop
function positionCard() {
  if (window.innerWidth > 900) {
    cardGroup.position.set(4.5, 0, 0);
  } else {
    cardGroup.position.set(0, 0, -3);
  }
}
positionCard();

// Mouse & Touch Tracking
let mouseX = 0;
let mouseY = 0;
let currentRotX = 0.2;
let currentRotY = -0.3;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  positionCard();
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  // Smooth card tilt with mouse
  currentRotX += (mouseY * 1.2 - currentRotX + 0.15) * 0.05;
  currentRotY += (mouseX * 1.2 - currentRotY - 0.25) * 0.05;

  cardMesh.rotation.x = currentRotX + Math.sin(time * 0.8) * 0.05;
  cardMesh.rotation.y = currentRotY + Math.cos(time * 0.8) * 0.05;
  cardMesh.rotation.z = Math.sin(time * 0.5) * 0.03;

  // Move lights slightly for glossy reflection
  cyanLight.position.x = 6 + Math.sin(time) * 2;
  cyanLight.position.y = 6 + Math.cos(time) * 2;

  // Orbiting tokens
  tokens.forEach((t) => {
    t.angle += t.speed;
    const posX = cardGroup.position.x + Math.cos(t.angle) * t.orbitRadiusX;
    const posZ = cardGroup.position.z + Math.sin(t.angle) * t.orbitRadiusZ;
    const posY = cardGroup.position.y + t.yOffset + Math.sin(time * 2 + t.angle) * 0.4;

    t.mesh.position.set(posX, posY, posZ);
    t.mesh.rotation.y += 0.02;
    t.mesh.rotation.x += 0.015;
  });

  // Background particles drift
  particles.rotation.y = time * 0.02;

  renderer.render(scene, camera);
}
animate();

// --- Interactive APY & Cashback Calculator ---
const spendSlider = document.getElementById('spend-slider');
const spendDisplay = document.getElementById('spend-display');
const stakeSlider = document.getElementById('stake-slider');
const stakeDisplay = document.getElementById('stake-display');
const tierButtons = document.querySelectorAll('.tier-btn');

const cashbackVal = document.getElementById('cashback-val');
const stakingVal = document.getElementById('staking-val');
const totalBenefit = document.getElementById('total-benefit');

let currentCashbackRate = 0.03;
let currentApyRate = 0.08;
const usdtRubRate = 95; // Approximate exchange rate

function updateCalculator() {
  const monthlySpend = parseInt(spendSlider.value);
  const stakeUsdt = parseInt(stakeSlider.value);

  spendDisplay.textContent = monthlySpend.toLocaleString('ru-RU') + ' ₽';
  stakeDisplay.textContent = stakeUsdt.toLocaleString('en-US') + ' $';

  // Yearly cashback in RUB
  const yearlyCashback = Math.round(monthlySpend * 12 * currentCashbackRate);
  // Yearly staking in USDT
  const yearlyStakingUsdt = Math.round(stakeUsdt * currentApyRate);
  // Combined in RUB
  const combinedBenefitRub = yearlyCashback + (yearlyStakingUsdt * usdtRubRate);

  cashbackVal.textContent = yearlyCashback.toLocaleString('ru-RU') + ' ₽';
  stakingVal.textContent = '+ ' + yearlyStakingUsdt.toLocaleString('en-US') + ' USDT';
  totalBenefit.textContent = '≈ ' + combinedBenefitRub.toLocaleString('ru-RU') + ' ₽';
}

spendSlider.addEventListener('input', updateCalculator);
stakeSlider.addEventListener('input', updateCalculator);

tierButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tierButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCashbackRate = parseFloat(btn.dataset.cashback);
    currentApyRate = parseFloat(btn.dataset.apy);
    updateCalculator();
  });
});

updateCalculator();
