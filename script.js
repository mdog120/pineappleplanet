// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Score
let score = 0;
const scoreDisplay = document.getElementById('score');
scoreDisplay.innerText = score;

// Spaceship
let spaceship = {
  x: 375,
  y: 420,
  width: 50,
  height: 50,
  color: 'white',
  thrusterOffset: 10,
  thrusterToggle: true
};

// Pineapples
let pineapples = [];
for (let i = 0; i < 4; i++) {
  pineapples.push({ x: Math.random() * 750, y: Math.random() * -500, width: 25, height: 35 });
}

// Monsters
let monsters = [];
for (let i = 0; i < 3; i++) {
  monsters.push({ x: Math.random() * 750, y: Math.random() * -500, width: 40, height: 40, dir: Math.random() > 0.5 ? 1 : -1 });
}

// Stars
let stars = [];
for (let i = 0; i < 50; i++) {
  stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 });
}

// Planets
let planets = [
  { x: 100, y: 50, r: 30, color: '#f4a261', dx: 0.2, dy: 0.1 },
  { x: 500, y: 120, r: 20, color: '#2a9d8f', dx: -0.15, dy: 0.05 }
];

// Sparkles
let sparkles = [];

// Controls
let keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// Collision detection
function detectCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Draw stars
function drawStars() {
  ctx.fillStyle = 'white';
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Draw planets
function drawPlanets() {
  planets.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x > canvas.width + p.r) p.x = -p.r;
    if (p.x < -p.r) p.x = canvas.width + p.r;
    if (p.y > canvas.height + p.r) p.y = -p.r;
    if (p.y < -p.r) p.y = canvas.height + p.r;
  });
}

// Draw spaceship
function drawSpaceship() {
  // Thruster flame animation
  ctx.fillStyle = 'orange';
  ctx.beginPath();
  const flameSize = spaceship.thrusterToggle ? 12 : 8;
  ctx.moveTo(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height + flameSize);
  ctx.lineTo(spaceship.x + spaceship.width / 2 - 7, spaceship.y + spaceship.height);
  ctx.lineTo(spaceship.x + spaceship.width / 2 + 7, spaceship.y + spaceship.height);
  ctx.closePath();
  ctx.fill();
  spaceship.thrusterToggle = !spaceship.thrusterToggle;

  // Body
  ctx.fillStyle = spaceship.color;
  ctx.beginPath();
  ctx.moveTo(spaceship.x + spaceship.width / 2, spaceship.y);
  ctx.lineTo(spaceship.x, spaceship.y + spaceship.height);
  ctx.lineTo(spaceship.x + spaceship.width, spaceship.y + spaceship.height);
  ctx.closePath();
  ctx.fill();

  // Window
  ctx.fillStyle = 'skyblue';
  ctx.beginPath();
  ctx.arc(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height / 2, 8, 0, Math.PI * 2);
  ctx.fill();
}

// Draw pineapples
function drawPineapples() {
  pineapples.forEach(p => {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.ellipse(p.x + p.width / 2, p.y + p.height / 2, p.width / 2, p.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Green top
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(p.x + p.width / 2, p.y);
    ctx.lineTo(p.x + p.width / 2 - 6, p.y + 12);
    ctx.lineTo(p.x + p.width / 2 + 6, p.y + 12);
    ctx.closePath();
    ctx.fill();
  });
}

// Draw monsters
function drawMonsters() {
  monsters.forEach(m => {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(m.x + m.width / 2, m.y + m.height / 2, m.width / 2, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(m.x + m.width / 3, m.y + m.height / 3, 5, 0, Math.PI * 2);
    ctx.arc(m.x + 2 * m.width / 3, m.y + m.height / 3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(m.x + m.width / 3, m.y + m.height / 3, 2.5, 0, Math.PI * 2);
    ctx.arc(m.x + 2 * m.width / 3, m.y + m.height / 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Sparkle effect
function spawnSparkles(x, y) {
  for (let i = 0; i < 8; i++) {
    sparkles.push({
      x: x,
      y: y,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 1.5) * 2,
      alpha: 1,
      size: Math.random() * 3 + 2
    });
  }
}

function drawSparkles() {
  sparkles.forEach((s, i) => {
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
    s.x += s.dx;
    s.y += s.dy;
    s.alpha -= 0.03;
    if (s.alpha <= 0) sparkles.splice(i, 1);
  });
}

// Update game
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();
  drawPlanets();

  // Spaceship movement
  if (keys['ArrowLeft']) spaceship.x -= 6;
  if (keys['ArrowRight']) spaceship.x += 6;
  if (keys['ArrowUp']) spaceship.y -= 6;
  if (keys['ArrowDown']) spaceship.y += 6;

  // Boundaries
  if (spaceship.x < 0) spaceship.x = 0;
  if (spaceship.x + spaceship.width > canvas.width) spaceship.x = canvas.width - spaceship.width;
  if (spaceship.y < 0) spaceship.y = 0;
  if (spaceship.y + spaceship.height > canvas.height) spaceship.y = canvas.height - spaceship.height;

  // Pineapples movement
  pineapples.forEach(p => {
    p.y += 2 + score * 0.05;
    if (p.y > canvas.height) {
      p.y = -30;
      p.x = Math.random() * 770;
    }
    if (detectCollision(spaceship, p)) {
      score++;
      scoreDisplay.innerText = score;
      spawnSparkles(p.x + p.width / 2, p.y + p.height / 2);
      p.y = -30;
      p.x = Math.random() * 770;
    }
  });

  // Monsters movement
  monsters.forEach(m => {
    m.y += 1 + score * 0.03;
    m.x += Math.sin(Date.now() / 200 + m.y / 50) * 2; // wobble side to side
    if (m.y > canvas.height) {
      m.y = -40;
      m.x = Math.random() * 760;
    }
    if (detectCollision(spaceship, m)) {
      // Game over screen
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '30px Segoe UI';
      ctx.fillText(`Game Over! Score: ${score}`, canvas.width / 2 - 150, canvas.height / 2);
      score = 0;
      spaceship.x = 375;
      spaceship.y = 420;
    }
  });

  drawSpaceship();
  drawPineapples();
  drawMonsters();
  drawSparkles();

  requestAnimationFrame(update);
}

update();
