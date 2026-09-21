// --- Spotlight Hover Effect (Linear / Raycast Bento Style) ---
const cards = document.querySelectorAll('.spotlight-card');

function handleCardMouseMove(e) {
  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  this.style.setProperty('--mouse-x', `${x}px`);
  this.style.setProperty('--mouse-y', `${y}px`);
}

cards.forEach(card => {
  card.addEventListener('mousemove', handleCardMouseMove);
});

// --- High-Performance Ambient Dot Matrix Canvas ---
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let dots = [];
const spacing = 38; // Distance between dots
let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  initDots();
}

function initDots() {
  dots = [];
  const cols = Math.ceil(width / spacing);
  const rows = Math.ceil(height / spacing);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({
        baseX: c * spacing + (spacing / 2),
        baseY: r * spacing + (spacing / 2),
        x: c * spacing + (spacing / 2),
        y: r * spacing + (spacing / 2),
        alpha: 0.15,
        targetAlpha: 0.15
      });
    }
  }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
  mouse.targetX = e.clientX;
  mouse.targetY = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.targetX = -1000;
  mouse.targetY = -1000;
});

// Animation Loop
function render() {
  requestAnimationFrame(render);

  // Smooth mouse lerp
  mouse.x += (mouse.targetX - mouse.x) * 0.1;
  mouse.y += (mouse.targetY - mouse.y) * 0.1;

  ctx.clearRect(0, 0, width, height);

  // Draw subtle ambient glow near mouse
  if (mouse.x > 0 && mouse.y > 0) {
    const glowGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 350);
    glowGradient.addColorStop(0, 'rgba(99, 102, 241, 0.07)');
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw dot matrix
  const radiusInfluence = 180;

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const dx = mouse.x - dot.baseX;
    const dy = mouse.y - dot.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radiusInfluence) {
      // Repel slightly and illuminate
      const factor = 1 - (dist / radiusInfluence);
      const angle = Math.atan2(dy, dx);
      dot.x = dot.baseX - Math.cos(angle) * (factor * 8);
      dot.y = dot.baseY - Math.sin(angle) * (factor * 8);
      dot.alpha = 0.15 + (factor * 0.7);
      
      ctx.fillStyle = factor > 0.4 ? 'rgba(99, 102, 241, ' + dot.alpha + ')' : 'rgba(255, 255, 255, ' + dot.alpha + ')';
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 1.2 + factor * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else {
      dot.x = dot.baseX;
      dot.y = dot.baseY;
      dot.alpha = 0.12;

      ctx.fillStyle = 'rgba(255, 255, 255, ' + dot.alpha + ')';
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

resizeCanvas();
render();
