// --- 3D Scene Initialization for Coffee Roastery ---
const canvas = document.getElementById('coffee-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 14);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
scene.add(ambientLight);

const warmPointLight = new THREE.PointLight(0xd4af37, 2.5, 30);
warmPointLight.position.set(5, 8, 5);
scene.add(warmPointLight);

const rimLight = new THREE.PointLight(0xffffff, 1.2, 20);
rimLight.position.set(-6, -2, -4);
scene.add(rimLight);

// Group to hold all 3D coffee elements
const coffeeGroup = new THREE.Group();
scene.add(coffeeGroup);

// Materials
const porcelainMat = new THREE.MeshStandardMaterial({
  color: 0x1f1712,
  roughness: 0.35,
  metalness: 0.1,
});

const goldRimMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  roughness: 0.2,
  metalness: 0.9,
});

const liquidMat = new THREE.MeshStandardMaterial({
  color: 0x22130c,
  roughness: 0.1,
  metalness: 0.05
});

// 1. Coffee Cup Body
const cupGeo = new THREE.CylinderGeometry(2.4, 1.6, 3.2, 32, 1, true);
const cupMesh = new THREE.Mesh(cupGeo, porcelainMat);
cupMesh.position.y = 1.6;
coffeeGroup.add(cupMesh);

// Cup Interior / Bottom
const cupBottomGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.1, 32);
const cupBottom = new THREE.Mesh(cupBottomGeo, porcelainMat);
cupBottom.position.y = 0.05;
coffeeGroup.add(cupBottom);

// Gold Rim on Cup
const rimTorus = new THREE.TorusGeometry(2.4, 0.06, 16, 64);
const rimMesh = new THREE.Mesh(rimTorus, goldRimMat);
rimMesh.rotation.x = Math.PI / 2;
rimMesh.position.y = 3.2;
coffeeGroup.add(rimMesh);

// Coffee Liquid
const liquidGeo = new THREE.CircleGeometry(2.32, 32);
const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
liquidMesh.rotation.x = -Math.PI / 2;
liquidMesh.position.y = 3.0;
coffeeGroup.add(liquidMesh);

// Cup Handle
const handleGeo = new THREE.TorusGeometry(1.1, 0.25, 16, 32, Math.PI);
const handleMesh = new THREE.Mesh(handleGeo, porcelainMat);
handleMesh.position.set(2.4, 1.6, 0);
handleMesh.rotation.z = -Math.PI / 2;
coffeeGroup.add(handleMesh);

// Saucer
const saucerGeo = new THREE.CylinderGeometry(3.8, 2.2, 0.3, 32);
const saucerMesh = new THREE.Mesh(saucerGeo, porcelainMat);
saucerMesh.position.y = -0.1;
coffeeGroup.add(saucerMesh);

// 2. Floating Coffee Beans
const beanGeo = new THREE.SphereGeometry(0.35, 16, 16);
beanGeo.scale(1, 1.5, 0.7); // Shape of coffee bean
const beanMat = new THREE.MeshStandardMaterial({
  color: 0x3d2314,
  roughness: 0.6,
  metalness: 0.1
});

const beans = [];
const beanCount = 14;

for (let i = 0; i < beanCount; i++) {
  const bean = new THREE.Mesh(beanGeo, beanMat);
  const angle = (i / beanCount) * Math.PI * 2;
  const radius = 4.5 + Math.random() * 2.5;
  const height = (Math.random() - 0.5) * 6 + 1;

  bean.position.set(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  );

  bean.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  bean.userData = {
    speed: 0.008 + Math.random() * 0.01,
    angle: angle,
    radius: radius,
    initialY: height,
    floatSpeed: 0.5 + Math.random() * 0.8
  };

  coffeeGroup.add(bean);
  beans.push(bean);
}

// 3. Steam Particles
const steamCount = 70;
const steamGeo = new THREE.BufferGeometry();
const steamPositions = new Float32Array(steamCount * 3);

for (let i = 0; i < steamCount; i++) {
  steamPositions[i * 3] = (Math.random() - 0.5) * 2;
  steamPositions[i * 3 + 1] = 3.2 + Math.random() * 4;
  steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
}

steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
const steamMat = new THREE.PointsMaterial({
  color: 0xffeedd,
  size: 0.25,
  transparent: true,
  opacity: 0.35,
  blending: THREE.AdditiveBlending
});

const steamParticles = new THREE.Points(steamGeo, steamMat);
coffeeGroup.add(steamParticles);

// Position entire group to the right side on desktop
function updateGroupPosition() {
  if (window.innerWidth > 900) {
    coffeeGroup.position.set(4.5, -0.5, 0);
  } else {
    coffeeGroup.position.set(0, 0, -2);
  }
}
updateGroupPosition();

// Mouse Parallax
let mouseX = 0;
let mouseY = 0;
let targetRotX = 0.35;
let targetRotY = -0.4;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateGroupPosition();
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();

  // Smooth cup rotation
  targetRotX += (mouseY - targetRotX + 0.3) * 0.04;
  targetRotY += (mouseX - targetRotY - 0.3) * 0.04;

  coffeeGroup.rotation.x = targetRotX;
  coffeeGroup.rotation.y = time * 0.15 + targetRotY;

  // Animate Beans orbit & floating
  beans.forEach((bean) => {
    bean.userData.angle += bean.userData.speed;
    bean.position.x = Math.cos(bean.userData.angle) * bean.userData.radius;
    bean.position.z = Math.sin(bean.userData.angle) * bean.userData.radius;
    bean.position.y = bean.userData.initialY + Math.sin(time * bean.userData.floatSpeed) * 0.5;
    bean.rotation.x += 0.01;
    bean.rotation.y += 0.015;
  });

  // Animate Steam rising
  const pos = steamGeo.attributes.position.array;
  for (let i = 0; i < steamCount; i++) {
    pos[i * 3 + 1] += 0.025; // rise up
    pos[i * 3] += Math.sin(time * 2 + i) * 0.008; // wobble

    if (pos[i * 3 + 1] > 7.5) {
      pos[i * 3 + 1] = 3.2;
      pos[i * 3] = (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }
  }
  steamGeo.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();

// --- Menu Tab Filtering ---
const tabButtons = document.querySelectorAll('.tab-btn');
const menuItems = document.querySelectorAll('.menu-item');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    menuItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
