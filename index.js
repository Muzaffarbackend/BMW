
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// MOBILE MENU
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('active');
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
  });
});

// THREE JS SCENE
const canvas = document.getElementById('carCanvas');

const scene = new THREE.Scene();

scene.background = null;

const camera = new THREE.PerspectiveCamera(
  45,
  1,
  0.1,
  100
);

camera.position.set(7, 4, 9);
camera.lookAt(0, 0.5, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// LIGHTS
const ambient = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambient);

const mainLight = new THREE.DirectionalLight(0xffffff, 3);
mainLight.position.set(5, 8, 5);
mainLight.castShadow = true;
scene.add(mainLight);

const blueLight = new THREE.PointLight(0x1689ff, 35, 15);
blueLight.position.set(-4, 2, -3);
scene.add(blueLight);

// MATERIALS
const bodyMaterial = new THREE.MeshStandardMaterial({
  color: 0x0878df,
  metalness: 0.8,
  roughness: 0.22
});

const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0x111c2d,
  metalness: 0.7,
  roughness: 0.12
});

const tireMaterial = new THREE.MeshStandardMaterial({
  color: 0x101010,
  roughness: 0.85
});

const metalMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  metalness: 0.9,
  roughness: 0.2
});

const blackMaterial = new THREE.MeshStandardMaterial({
  color: 0x050505,
  metalness: 0.5,
  roughness: 0.3
});

// CAR GROUP
const car = new THREE.Group();
scene.add(car);

// BODY
function createBox(w, h, d, material, x, y, z) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  car.add(mesh);
  return mesh;
}

// Main body
createBox(4.2, 0.65, 1.8, bodyMaterial, 0, 0.85, 0);

// Hood
createBox(1.15, 0.18, 1.75, bodyMaterial, -1.45, 1.15, 0);

// Rear
createBox(0.8, 0.2, 1.7, bodyMaterial, 1.65, 1.12, 0);

// CABIN
const cabinGeometry = new THREE.BoxGeometry(2.15, 0.75, 1.55);
const cabin = new THREE.Mesh(cabinGeometry, glassMaterial);

cabin.position.set(0.1, 1.5, 0);
cabin.scale.set(1, 0.8, 1);
cabin.castShadow = true;
car.add(cabin);

// ROOF
createBox(1.6, 0.1, 1.45, bodyMaterial, 0.1, 1.91, 0);

// WHEELS
function createWheel(x, z) {
  const wheelGroup = new THREE.Group();

  const tireGeometry = new THREE.CylinderGeometry(
    0.52,
    0.52,
    0.28,
    48
  );

  const tire = new THREE.Mesh(tireGeometry, tireMaterial);

  tire.rotation.x = Math.PI / 2;
  wheelGroup.add(tire);

  const rimGeometry = new THREE.CylinderGeometry(
    0.31,
    0.31,
    0.3,
    32
  );

  const rim = new THREE.Mesh(rimGeometry, metalMaterial);
  rim.rotation.x = Math.PI / 2;
  wheelGroup.add(rim);

  const center = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.32, 24),
    blackMaterial
  );

  center.rotation.x = Math.PI / 2;
  wheelGroup.add(center);

  wheelGroup.position.set(x, 0.52, z);

  car.add(wheelGroup);

  return wheelGroup;
}

const wheels = [
  createWheel(-1.35, 0.92),
  createWheel(1.35, 0.92),
  createWheel(-1.35, -0.92),
  createWheel(1.35, -0.92)
];

// FRONT GRILLE
createBox(0.08, 0.35, 0.55, blackMaterial, -2.13, 0.9, 0);
createBox(0.09, 0.3, 0.2, metalMaterial, -2.19, 0.9, 0.31);
createBox(0.09, 0.3, 0.2, metalMaterial, -2.19, 0.9, -0.31);

// HEADLIGHTS
const headlightMaterial = new THREE.MeshBasicMaterial({
  color: 0xaadfff
});

createBox(0.08, 0.13, 0.48, headlightMaterial, -2.16, 1.1, 0.62);
createBox(0.08, 0.13, 0.48, headlightMaterial, -2.16, 1.1, -0.62);

// REAR LIGHTS
const rearLight = new THREE.MeshBasicMaterial({
  color: 0xff1111
});

createBox(0.08, 0.13, 0.45, rearLight, 2.14, 1.08, 0.6);
createBox(0.08, 0.13, 0.45, rearLight, 2.14, 1.08, -0.6);

// FLOOR
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({
    color: 0x101722,
    roughness: 0.8
  })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.05;
floor.receiveShadow = true;
scene.add(floor);

// CAR POSITION
car.position.y = 0.05;
car.rotation.y = -0.5;

// RESIZE
function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height, false);
}

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas);
resize();

// MOUSE DRAG ROTATION
let dragging = false;
let previousX = 0;
let previousY = 0;

canvas.addEventListener('pointerdown', (e) => {
  dragging = true;
  previousX = e.clientX;
  previousY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;

  const deltaX = e.clientX - previousX;
  const deltaY = e.clientY - previousY;

  car.rotation.y += deltaX * 0.01;
  car.rotation.x += deltaY * 0.003;

  car.rotation.x = THREE.MathUtils.clamp(
    car.rotation.x,
    -0.2,
    0.2
  );

  previousX = e.clientX;
  previousY = e.clientY;
});

canvas.addEventListener('pointerup', () => {
  dragging = false;
});

canvas.addEventListener('pointercancel', () => {
  dragging = false;
});

// ROTATE BUTTON
const rotateBtn = document.getElementById('rotateBtn');

let autoRotate = false;

rotateBtn.addEventListener('click', () => {
  autoRotate = !autoRotate;

  rotateBtn.textContent = autoRotate
    ? 'Aylantirishni to‘xtatish'
    : '3D aylantirish';
});

// ANIMATION
function animate() {
  requestAnimationFrame(animate);

  if (autoRotate && !dragging) {
    car.rotation.y += 0.008;
  }

  wheels.forEach(wheel => {
    wheel.rotation.z += 0;
  });

  renderer.render(scene, camera);
}

animate();
