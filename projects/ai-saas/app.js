// --- 3D Neural Synapse Matrix with Three.js ---
const canvas = document.getElementById('neural-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Neural Network Nodes & Links
const nodeCount = 65;
const nodePositions = [];
const nodeGroup = new THREE.Group();
scene.add(nodeGroup);

const nodeGeo = new THREE.SphereGeometry(0.35, 16, 16);
const nodeMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
const nodeActiveMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

for (let i = 0; i < nodeCount; i++) {
  const x = (Math.random() - 0.5) * 45;
  const y = (Math.random() - 0.5) * 35;
  const z = (Math.random() - 0.5) * 25;

  const mat = Math.random() > 0.7 ? nodeActiveMat : nodeMat;
  const mesh = new THREE.Mesh(nodeGeo, mat);
  mesh.position.set(x, y, z);
  nodeGroup.add(mesh);

  nodePositions.push(new THREE.Vector3(x, y, z));
}

// Synaptic Connecting Lines
const lineMat = new THREE.LineBasicMaterial({
  color: 0x6366f1,
  transparent: true,
  opacity: 0.25
});

const linePositions = [];
const maxDistance = 11;

for (let i = 0; i < nodeCount; i++) {
  for (let j = i + 1; j < nodeCount; j++) {
    const dist = nodePositions[i].distanceTo(nodePositions[j]);
    if (dist < maxDistance) {
      linePositions.push(
        nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
        nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
      );
    }
  }
}

const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
nodeGroup.add(lineSegments);

// Mouse parallax
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

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

  targetX += (mouseX - targetX) * 0.04;
  targetY += (mouseY - targetY) * 0.04;

  nodeGroup.rotation.y = time * 0.06 + targetX * 1.5;
  nodeGroup.rotation.x = Math.sin(time * 0.04) * 0.1 + targetY * 1.5;

  renderer.render(scene, camera);
}
animate();

// --- Interactive AI Simulator ---
const scenarios = {
  sales: {
    user: "«Здравствуйте! Хотим заказать сайт с 3D-графикой и подключить Telegram-бота. Какой порядок цен?»",
    ai: "«Здравствуйте! 3D-лендинг с анимацией стоит от 25 000 ₽, разработка бота от 15 000 ₽. Срок от 3 до 5 дней. Какой именно товар или услугу планируете презентовать? Могу рассчитать точную смету прямо сейчас.»"
  },
  support: {
    user: "«Клиент жалуется, что не может оплатить счет на сайте картой зарубежного банка. Что делать?»",
    ai: "«Synthetix AI подключил международный шлюз Stripe/Crypto. Клиенту отправлена персональная защищенная ссылка на оплату. Конверсия спасена, статус в CRM обновлен на Ожидание оплаты.»"
  },
  invoice: {
    user: "«Сформируй закрывающий акт и счет на предоплату 50% для ООО Вектор на сумму 40 000 рублей.»",
    ai: "«Документы сформированы за 0.8 сек. PDF-счет №204 и договор отправлены в диалог клиенту и прикреплены в сделку amoCRM. Ссылка на оплату сгенерирована.»"
  }
};

const scenarioButtons = document.querySelectorAll('.sim-scenario');
const chatMessages = document.getElementById('chat-messages');
const runBtn = document.getElementById('run-sim-btn');
let currentScenario = 'sales';

function renderScenario(key) {
  currentScenario = key;
  const data = scenarios[key];
  chatMessages.innerHTML = `
    <div class="msg user-msg">
      <div class="msg-author">Клиент:</div>
      <div class="msg-text">${data.user}</div>
    </div>
    <div class="msg ai-msg">
      <div class="msg-author">Synthetix AI:</div>
      <div class="msg-text">${data.ai}</div>
    </div>
  `;
}

scenarioButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    scenarioButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderScenario(btn.dataset.scenario);
  });
});

runBtn.addEventListener('click', () => {
  chatMessages.innerHTML = `
    <div class="msg user-msg">
      <div class="msg-author">Клиент:</div>
      <div class="msg-text">${scenarios[currentScenario].user}</div>
    </div>
    <div class="msg ai-msg">
      <div class="msg-author">Synthetix AI:</div>
      <div class="msg-text"><em>Генерация ответа и синхронизация с CRM...</em></div>
    </div>
  `;
  setTimeout(() => {
    renderScenario(currentScenario);
  }, 600);
});

// --- Billing Switch ---
const billingToggle = document.getElementById('billing-toggle');
const priceAmounts = document.querySelectorAll('.price-amount');

billingToggle.addEventListener('change', () => {
  const isAnnual = billingToggle.checked;
  priceAmounts.forEach(el => {
    const val = isAnnual ? el.dataset.year : el.dataset.month;
    el.innerHTML = `${val} ₽ <span>/ мес</span>`;
  });
});

// --- FAQ Accordion ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});
